const { PrismaClient } = require("@prisma/client");

class RoomService {
    constructor() {
        this.prisma = new PrismaClient();
    }

    async createRoom(data) {
        return await this.prisma.room.create({ data });
    }

    async getAllRooms() {
        return await this.prisma.room.findMany({
            // include: { hotel: true },
        });
    }








    //update hotel room 
    async getSingleRoom(roomId) {
        return await this.prisma.room.findUnique({
            where: { id: roomId },
            // include: { hotel: true, bookings: true },
        });
    }




    //update room
    async updateRoom(roomId, data) {
        return await this.prisma.room.update({
            where: { id: roomId },
            data,
        });
    }

    async deleteRoom(roomId) {
        return await this.prisma.room.delete({
            where: { id: roomId },
        });
    }

    async checkRoomAvailability(roomId, checkIn, checkOut) {
        const overlappingBookings = await this.prisma.booking.findMany({
            where: {
                roomId,
                OR: [
                    { checkIn: { lte: checkOut }, checkOut: { gte: checkIn } },
                ],
            },
        });

        return overlappingBookings.length === 0; // Returns true if available
    }


   async getRoomsByHotel(hotelId){

    return await this.prisma.room.findMany({
        where: {
          hotelId: hotelId,
        },
      });

   }
}

module.exports = RoomService;
