const express = require('express');
const { PrismaClient } = require('@prisma/client');
const UserController = require('../controllers/userController');
const UserService = require('../services/User/userService');
const AuthService = require('../services/Authentication/AuthService');
const AuthController = require('../controllers/AuthController');
const BcryptHasher = require('../utility/BcryptPasswordHasher');
const HotelService = require('../services/Hotel/HotelService');
const HotelController = require('../controllers/hotelController');
const RoomController = require('../controllers/RoomController');
const RoomService = require('../services/Room/RoomService');
const BookingService = require('../services/Booking/BookingService');
const BookingController = require('../controllers/BookingController');
const SliderController = require('../controllers/sliderController');
const SliderService = require('../services/Slider/SliderService');
const NotificationService = require('../services/Notification/NotificationService');
const NotificationController = require('../controllers/notificationController');
const DivisionService = require('../services/Division/divisionService');
const DivisionController = require('../controllers/divisionController');
const DistrictService = require('../services/District/districtService');
const DistrictController = require('../controllers/districtController');
const divisionService = new DivisionService();
const divisionController = new DivisionController(divisionService);
const AreaService = require('../services/Area/AreaService');
const AreaController = require('../controllers/areaController');

const router = express.Router();

const prisma = new PrismaClient();
const userService = new UserService(prisma)
const userController= new UserController(userService)
const hasher = new BcryptHasher()
const authService = new AuthService(prisma,hasher);
const authController = new AuthController(authService)
const hotelService = new HotelService(prisma);
const hotelController = new HotelController(hotelService);
const roomService = new RoomService();
const roomController= new RoomController(roomService)
const bookingService = new BookingService();
const bookingController = new BookingController(bookingService);
const sliderService = new SliderService(prisma);
const notificationService = new NotificationService(prisma);

const notificationController = new NotificationController(notificationService)
const districtService = new DistrictService();
const districtController = new DistrictController(districtService); 
const areaService = new AreaService();
const areaController = new AreaController(areaService)
//-------------------User Routes-----------------------
router.post("/user/register",async(req,res,next)=>{
    userController.createUser(req,res,next)

})

router.post("/user/login",async(req,res,next)=>{
    authController.login(req,res,next)
})

router.get("/user",async(req,res,next)=>{
    userController.getAllUsers(req,res,next)
})
router.get("/user/:id",async(req,res,next)=>{
    userController.getSingleUser(req,res,next)
})
router.put("/user/:id",async(req,res,next)=>{
    userController.updateUser(req,res,next)
})
router.delete("/user/:id",async(req,res,next)=>{
    userController.deleteUser(req,res,next)
})

//-------------------Hotel Routes-----------------------
router.post("/hotel/create",async(req,res,next)=>{
    hotelController.createHotel(req,res,next)
})
router.get("/hotel",async(req,res,next)=>{
    hotelController.getAllHotels(req,res,next)
})
router.get("/hotel/:id",async(req,res,next)=>{
    hotelController.getSingleHotel(req,res,next)
})
router.put("/hotel/:id",async(req,res,next)=>{
    hotelController.updateHotel(req,res,next)
})
router.delete("/hotel/:id",async(req,res,next)=>{
    hotelController.deleteHotel(req,res,next)
})


router.get("/hotel/:divisionId/division",async(req,res,next)=>{
    hotelController.getHotelByDivision(req,res,next)
})

router.get("/hotel/:areaId/area",async(req,res,next)=>{
    hotelController.getHotelByArea(req,res,next)
})
//-------------------Room Routes-----------------------
router.post("/room/create",async(req,res,next)=>{
    roomController.createRoom(req,res,next)
})
router.get("/room",async(req,res,next)=>{
    roomController.getAllRooms(req,res,next)
})
router.get("/room/:id",async(req,res,next)=>{
    roomController.getSingleRoom(req,res,next)
})
router.put("/room/:id",async(req,res,next)=>{
    roomController.updateRoom(req,res,next)
})
router.delete("/room/:id",async(req,res,next)=>{
    roomController.deleteRoom(req,res,next)
})
router.post("/room/checkAvailability",async(req,res,next)=>{
    roomController.checkAvailability(req,res,next)
})

router.get("/hotel/:hotelId/rooms",async(req,res,next)=>{
    roomController.getRoomsByHotel(req,res,next)
})

//-------------------Booking Routes-----------------------
router.post("/booking/create",async(req,res,next)=>{
    bookingController.createBooking(req,res,next)
})
router.get("/booking",async(req,res,next)=>{
    bookingController.getAllBookings(req,res,next)
})
router.get("/booking/:id",async(req,res,next)=>{
    bookingController.getSingleBooking(req,res,next)
})
router.put("/booking/:id",async(req,res,next)=>{
    bookingController.updateBooking(req,res,next)
})
router.delete("/booking/:id",async(req,res,next)=>{
    bookingController.deleteBooking(req,res,next)
})
router.post("/booking/check-availability",async(req,res,next)=>{
    bookingController.checkAvailability(req,res,next)
})

router.get("/booking/user/:userId",async(req,res,next)=>{
    bookingController.getBookingsByUser(req,res,next)
})


//slider routes
//[route("/sliders/create")]
router.post("/sliders/create", (req, res, next) => {
    const sliderController = new SliderController(sliderService);
    sliderController.createSlider(req, res, next)
})
//[route("/sliders")]
router.get("/sliders", (req, res, next) => {
    const sliderController = new SliderController(sliderService);
    sliderController.getSliders(req, res, next)
})
//[route("/sliders/{id}")]
router.get("/sliders/:id", (req, res, next) => {
    const sliderController = new SliderController(sliderService);
    sliderController.getSliderById(req, res, next)
})
//[route("/sliders/{id}")]
router.put("/sliders/:id", (req, res, next) => {
    const sliderController = new SliderController(sliderService);
    sliderController.updateSlider(req, res, next)
})
//[route("/sliders/{id}")]
router.delete("/sliders/:id", (req, res, next) => {
    const sliderController = new SliderController(sliderService);
    sliderController.deleteSlider(req, res, next)
})

//-------------------Notification Routes-----------------------
//[route("/notification/create")]
router.post("/notification/create", (req, res, next) => {
    notificationController.createNotification(req, res, next)
}
)
//[route("/notification")]
router.get("/notification/:userId", (req, res, next) => {
    notificationController.getNotifications(req, res, next)
}
)
//[route("/notification/{id}")]
router.put("/notification/:id/read", (req, res, next) => {
    notificationController.markAsRead(req, res, next)
}
)

//division routes
router.post("/division/create", (req, res, next) => {
    divisionController.createDivision(req, res, next)
})
router.get("/division", (req, res, next) => {
    divisionController.getAllDivisions(req, res, next)
})
router.get("/division/:id", (req, res, next) => {
    divisionController.getDivisionById(req, res, next)
})
router.put("/division/:id", (req, res, next) => {
    divisionController.updateDivision(req, res, next)
})
router.delete("/division/:id", (req, res, next) => {
    divisionController.deleteDivision(req, res, next)
})
//District routes
router.post("/district/create", (req, res, next) => {
    districtController.createDistrict(req, res, next)
})
router.get("/district", (req, res, next) => {
    districtController.getAllDistricts(req, res, next)
    
})
router.get("/district/:id", (req, res, next) => {
    districtController.getDistrictById(req, res, next)
})
router.put("/district/:id", (req, res, next) => {
    districtController.updateDistrict(req, res, next)
})
router.delete("/district/:id", (req, res, next) => {
    districtController.deleteDistrict(req, res, next)
})

router.get("/district/by-division/:id",(req, res, next) => {
    districtController.districtByDivision(req, res, next)
})

//area
router.post("/area/create", (req, res, next) => {
    areaController.createArea(req, res, next)
})
router.get("/area", areaController.getAllAreas.bind(areaController));
router.get("/area/:id", areaController.getAreaById.bind(areaController));
router.put("/area/:id", areaController.updateArea.bind(areaController));
router.delete("/area/:id", areaController.deleteArea.bind(areaController));
router.get("/area/by-district/:id",areaController.areaByDistrict.bind(areaController));

module.exports = router;
