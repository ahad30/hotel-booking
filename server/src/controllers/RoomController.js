const ResponseHandler = require("../shared/response.handaler");

class RoomController {
    constructor(roomService) {
        this.roomService = roomService;
    }

    async createRoom(req, res, next) {
        try {
            const result = await this.roomService.createRoom(req.body);
            ResponseHandler.success(res, "Room created successfully", result, 201);
        } catch (error) {
            next(error);
        }
    }

    async getAllRooms(req, res, next) {
        try {
            const result = await this.roomService.getAllRooms();
            ResponseHandler.success(res, "Rooms fetched successfully", result);
        } catch (error) {
            next(error);
        }
    }

    async getSingleRoom(req, res, next) {
        try {
            const roomId = req.params.id;
            const result = await this.roomService.getSingleRoom(roomId);
            ResponseHandler.success(res, `Room with ID ${roomId} fetched successfully`, result);
        } catch (error) {
            next(error);
        }
    }

    async updateRoom(req, res, next) {
        try {
            const roomId = req.params.id;
            const result = await this.roomService.updateRoom(roomId, req.body);
            ResponseHandler.success(res, `Room with ID ${roomId} updated successfully`, result);
        } catch (error) {
            next(error);
        }
    }

    async deleteRoom(req, res, next) {
        try {
            const roomId = req.params.id;
            await this.roomService.deleteRoom(roomId);
            ResponseHandler.success(res, `Room with ID ${roomId} deleted successfully`);
        } catch (error) {
            next(error);
        }
    }

    async checkAvailability(req, res, next) {
        try {
            const { roomId, checkIn, checkOut } = req.body;
            const isAvailable = await this.roomService.checkRoomAvailability(roomId, new Date(checkIn), new Date(checkOut));

            ResponseHandler.success(res, `Room availability checked`, { isAvailable });
        } catch (error) {
            next(error);
        }
    }

    async getRoomsByHotel(req,res,next){
        try {
            const { hotelId } = req.params;
            const result = await this.roomService.getRoomsByHotel(hotelId)
            if(!result || result.length === 0)
            {
                ResponseHandler.error(res,"No rooms found for this hotel.")
            }
            ResponseHandler.success(res,"Rooms Available",result,200)
            
        } catch (error) {
            next(error)
            
        }
    }
}

module.exports = RoomController;
