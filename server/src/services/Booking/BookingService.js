const { PrismaClient } = require("@prisma/client");
const PaymentGatewayService = require("../PaymentGateway/PaymentGatewayService");
const catchAsync = require("../../shared/catchAsync");
const { ObjectId } = require('mongodb');
const ApiError = require("../../error/handleApiError");

// Unpaid checkouts hold their rooms for this long while the customer pays.
const HOLD_MINUTES = 30;

class BookingService {
    constructor() {
        this.prisma = new PrismaClient();
        this.paymentService = new PaymentGatewayService();
    }

    async createBooking(data) {
        // Re-check every room before sending the customer to payment: it may
        // have sold out since they selected it, or the API was called directly.
        for (const item of data.bookingItem || []) {
            const { available, remaining } = await this.checkAvailability({
                roomId: item.roomId,
                checkIn: data.checkIn,
                checkOut: data.checkOut,
                quantity: item.quantity,
            });
            if (!available) {
                throw new ApiError(
                    409,
                    remaining > 0
                        ? `Only ${remaining} ${item.roomType || ""} room(s) left for these dates. Please update your selection.`
                        : `${item.roomType || "This"} room is no longer available for these dates.`
                );
            }
        }

        const { GatewayPageURL, tranId } = await this.paymentService.createPayment({
            name: data.name,
            email: data.email,
            phone: data.phone,
            address: data.address,
            productName: "Room Booking",
            price: data.totalPrice
        });
        // console.log(GatewayPageURL, "--------------------")

        // console.log(this.prisma,"--------------------")
        const booking = await this.prisma.booking.create({
            data: {
                ...data,
                transactionId: tranId,
            },
        });
        await this.prisma.notification.create({
            data: {
                userId: data.userId,
                title:"Booking Confirmation",
                message: `Your booking has been created successfully. Booking ID: ${booking.id}`,
               bookingId: booking.id,
               
                type: 'BOOKING_CONFIRMATION',
                link:"/user/user-booking",
            },
        })
        await this.prisma.payment.create({
            data: {
                bookingId: booking.id, // after creating booking
                tranId,
                method: 'sslcommerz',
                amount: data.totalPrice,
            },
        });
        return {
            booking,
            payment_url: GatewayPageURL,
        };
    }

    async getAllBookings() {
        const bookings = await this.prisma.booking.findMany();
      
        const bookingsWithRooms = await Promise.all(
          bookings.map(async (booking) => {
            const rooms = await this.prisma.room.findMany({
              where: {
                id: {
                  in: booking.roomIds,
                },
              },
            });
      
            return {
              ...booking,
              rooms, // attach the rooms here
            };
          })
        );
      
        return bookingsWithRooms;
      }

    async getSingleBooking(bookingId) {
        return await this.prisma.booking.findUnique({
            where: { id: bookingId },
            // include: { room: true },
        });
    }

    async updateBooking(bookingId, data) {
        return await this.prisma.booking.update({
            where: { id: bookingId },
            data,
        });
    }

    async deleteBooking(bookingId) {
        return await this.prisma.booking.delete({
            where: { id: bookingId },
        });
    }
    async getBookingsByUser(userId) {
        const bookings = await this.prisma.booking.findMany({
          where: { userId },
        });
      
        const bookingsWithRooms = await Promise.all(
          bookings.map(async (booking) => {
            const rooms = await this.prisma.room.findMany({
              where: {
                id: {
                  in: booking.roomIds,
                },
              },
            });
      
            return {
              ...booking,
              rooms, // attach rooms here
            };
          })
        );
      
        return bookingsWithRooms;
      }
      
    // Bookings that still hold rooms on these dates: paid or admin-confirmed,
    // or unpaid but younger than the hold window. Failed/cancelled never count.
    activeOverlapping(roomId, start, end) {
        const holdCutoff = new Date(Date.now() - HOLD_MINUTES * 60 * 1000);
        return this.prisma.booking.findMany({
            where: {
                roomIds: { has: roomId },
                AND: [
                    { checkIn: { lt: end } },
                    { checkOut: { gt: start } },
                    { status: { not: "cancelled" } },
                    { paymentStatus: { not: "failed" } },
                    {
                        OR: [
                            { paymentStatus: "paid" },
                            { status: "confirmed" },
                            { createdAt: { gte: holdCutoff } },
                        ],
                    },
                ],
            },
        });
    }

    // Rooms of one type already taken on overlapping dates. A booking stores
    // the quantity per room in bookingItem; older ones without it count as 1.
    bookedQuantity(bookings, roomId) {
        return bookings.reduce((sum, booking) => {
            const items = (booking.bookingItem || []).filter((i) => i?.roomId === roomId);
            const qty = items.reduce((s, i) => s + (Number(i.quantity) || 1), 0);
            return sum + (items.length ? qty : 1);
        }, 0);
    }

    // A room type is available while enough of its roomQty units are free.
    async checkAvailability({ roomId, checkIn, checkOut, quantity = 1 }) {
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const requested = Math.max(1, Number(quantity) || 1);

        const room = await this.prisma.room.findUnique({ where: { id: roomId } });
        if (!room || !room.isAvailable) {
            return { available: false, remaining: 0, message: "This room isn't available for booking." };
        }

        const overlapping = await this.activeOverlapping(roomId, start, end);
        const remaining = Math.max(0, (room.roomQty || 0) - this.bookedQuantity(overlapping, roomId));

        if (remaining < requested) {
            return {
                available: false,
                remaining,
                message:
                    remaining > 0
                        ? `Only ${remaining} room(s) of this type left for these dates.`
                        : "Room is already booked in this time slot.",
            };
        }

        return {
            available: true,
            remaining,
            message: "Room is available for booking."
        };
    }

    // async checkAvailability(roomId, checkIn, checkOut) {
    //     const overlappingBookings = await this.prisma.booking.findMany({
    //         where: {
    //             roomId,
    //             OR: [
    //                 { checkIn: { lte: checkOut }, checkOut: { gte: checkIn } },
    //             ],
    //         },
    //     });

    //     return overlappingBookings.length === 0;
    // }
}

module.exports = BookingService;
