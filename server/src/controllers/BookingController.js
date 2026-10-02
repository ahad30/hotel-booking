const catchAsync = require("../shared/catchAsync");
const ResponseHandler = require("../shared/response.handaler");

class BookingController {
    constructor(bookingService) {
        this.bookingService = bookingService;
    }

    async createBooking(req, res, next) {
        try {
            const result = await this.bookingService.createBooking(req.body);
            ResponseHandler.success(res, "Booking created successfully", result, 201);
        } catch (error) {
            next(error);
        }
    }

    async getAllBookings(req, res, next) {
        try {
            const result = await this.bookingService.getAllBookings();
            ResponseHandler.success(res, "Bookings fetched successfully", result);
        } catch (error) {
            next(error);
        }
    }

    async getSingleBooking(req, res, next) {
        try {
            const bookingId = req.params.id;
            const result = await this.bookingService.getSingleBooking(bookingId);
            ResponseHandler.success(res, `Booking with ID ${bookingId} fetched successfully`, result);
        } catch (error) {
            next(error);
        }
    }

    async updateBooking(req, res, next) {
        try {
            const bookingId = req.params.id;
            const result = await this.bookingService.updateBooking(bookingId, req.body);
            ResponseHandler.success(res, `Booking with ID ${bookingId} updated successfully`, result);
        } catch (error) {
            next(error);
        }
    }

    async deleteBooking(req, res, next) {
        try {
            const bookingId = req.params.id;
            await this.bookingService.deleteBooking(bookingId);
            ResponseHandler.success(res, `Booking with ID ${bookingId} deleted successfully`);
        } catch (error) {
            next(error);
        }
    }

    async getBookingsByUser(req, res, next) {
        try {
            const userId = req.params.userId;
            const result = await this.bookingService.getBookingsByUser(userId);
            ResponseHandler.success(res, `Bookings for user with ID ${userId} fetched successfully`, result);
        } catch (error) {
            next(error);
        }
    }
     
checkAvailability=catchAsync(async (req, res, next) => {
    const { roomId, checkIn, checkOut } = req.body;

    const result = await this.bookingService.checkAvailability({ roomId, checkIn, checkOut });

    ResponseHandler.success(res, "Availability checked successfully", result);

})
    
}

module.exports = BookingController;
