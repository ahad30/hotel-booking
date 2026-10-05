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
const PaymentService = require('../services/Payment/PaymentService');
const PaymentController = require('../controllers/paymentController');
const InboxService = require('../services/Inbox/InboxService');
const InboxController = require('../controllers/inboxController');
const { auth, optionalAuth, selfOrAdmin } = require('../middleware/auth');
const rateLimit = require('../middleware/rateLimit');
const AssistantService = require('../services/Assistant/AssistantService');
const AssistantController = require('../controllers/assistantController');
const ApiError = require('../error/handleApiError');

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
const paymentService = new PaymentService(prisma);
const paymentController = new PaymentController(paymentService);
const inboxController = new InboxController(new InboxService(prisma));
const assistantController = new AssistantController(new AssistantService(prisma));
//-------------------User Routes-----------------------
router.post("/user/register",optionalAuth,async(req,res,next)=>{
    userController.createUser(req,res,next)

})

router.post("/user/login",async(req,res,next)=>{
    authController.login(req,res,next)
})

router.get("/user",auth("admin"), async(req,res,next)=>{
    userController.getAllUsers(req,res,next)
})
// Must be registered before /user/:id.
router.get("/user/me",auth(), (req,res,next)=>{
    userController.getMe(req,res,next)
})
router.get("/user/:id",auth(), selfOrAdmin("id"),async(req,res,next)=>{
    userController.getSingleUser(req,res,next)
})
router.put("/user/:id",auth(), selfOrAdmin("id"),async(req,res,next)=>{
    userController.updateUser(req,res,next)
})
router.delete("/user/:id",auth("admin"), async(req,res,next)=>{
    userController.deleteUser(req,res,next)
})

//-------------------Hotel Routes-----------------------
router.post("/hotel/create",auth("admin"), async(req,res,next)=>{
    hotelController.createHotel(req,res,next)
})
router.get("/hotel",async(req,res,next)=>{
    hotelController.getAllHotels(req,res,next)
})
router.get("/hotel/:id",async(req,res,next)=>{
    hotelController.getSingleHotel(req,res,next)
})
router.put("/hotel/:id",auth("admin"), async(req,res,next)=>{
    hotelController.updateHotel(req,res,next)
})
router.delete("/hotel/:id",auth("admin"), async(req,res,next)=>{
    hotelController.deleteHotel(req,res,next)
})


router.get("/hotel/:divisionId/division",async(req,res,next)=>{
    hotelController.getHotelByDivision(req,res,next)
})

router.get("/hotel/:areaId/area",async(req,res,next)=>{
    hotelController.getHotelByArea(req,res,next)
})
//-------------------Room Routes-----------------------
router.post("/room/create",auth("admin"), async(req,res,next)=>{
    roomController.createRoom(req,res,next)
})
router.get("/room",async(req,res,next)=>{
    roomController.getAllRooms(req,res,next)
})
router.get("/room/:id",async(req,res,next)=>{
    roomController.getSingleRoom(req,res,next)
})
router.put("/room/:id",auth("admin"), async(req,res,next)=>{
    roomController.updateRoom(req,res,next)
})
router.delete("/room/:id",auth("admin"), async(req,res,next)=>{
    roomController.deleteRoom(req,res,next)
})
router.post("/room/checkAvailability",async(req,res,next)=>{
    roomController.checkAvailability(req,res,next)
})

// Public availability calendar: ?from=YYYY-MM-DD&days=1..62 (defaults: today, 42)
router.get("/hotel/:hotelId/availability", async (req, res, next) => {
    try {
        const today = new Date().toISOString().slice(0, 10);
        const from = /^\d{4}-\d{2}-\d{2}$/.test(req.query.from || "") && req.query.from >= today ? req.query.from : today;
        const days = Math.min(62, Math.max(1, parseInt(req.query.days, 10) || 42));
        const data = await bookingService.availabilityCalendar(req.params.hotelId, from, days);
        res.status(200).json({ success: true, message: "Availability calendar", data });
    } catch (error) {
        next(error);
    }
})

router.get("/hotel/:hotelId/rooms",async(req,res,next)=>{
    roomController.getRoomsByHotel(req,res,next)
})

//-------------------Booking Routes-----------------------
router.post("/booking/create",auth(), async(req,res,next)=>{
    // Guests always book for themselves, whatever the request body says.
    if (req.user.role !== "admin") req.body.userId = req.user.id;
    bookingController.createBooking(req,res,next)
})
router.get("/booking",auth("admin"), async(req,res,next)=>{
    bookingController.getAllBookings(req,res,next)
})
router.get("/booking/:id",auth(), async(req,res,next)=>{
    try {
        if (req.user.role !== "admin") {
            const booking = await prisma.booking.findUnique({ where: { id: req.params.id }, select: { userId: true } });
            if (booking && booking.userId !== req.user.id) return next(new ApiError(403, "You can only view your own bookings."));
        }
        bookingController.getSingleBooking(req,res,next)
    } catch (error) {
        next(error)
    }
})
router.put("/booking/:id",auth("admin"), async(req,res,next)=>{
    bookingController.updateBooking(req,res,next)
})
router.delete("/booking/:id",auth("admin"), async(req,res,next)=>{
    bookingController.deleteBooking(req,res,next)
})
router.post("/booking/check-availability",async(req,res,next)=>{
    bookingController.checkAvailability(req,res,next)
})

router.get("/booking/user/:userId",auth(), selfOrAdmin("userId"),async(req,res,next)=>{
    bookingController.getBookingsByUser(req,res,next)
})


//slider routes
//[route("/sliders/create")]
router.post("/sliders/create", auth("admin"), (req, res, next) => {
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
router.put("/sliders/:id", auth("admin"), (req, res, next) => {
    const sliderController = new SliderController(sliderService);
    sliderController.updateSlider(req, res, next)
})
//[route("/sliders/{id}")]
router.delete("/sliders/:id", auth("admin"), (req, res, next) => {
    const sliderController = new SliderController(sliderService);
    sliderController.deleteSlider(req, res, next)
})

//-------------------Notification Routes-----------------------
//[route("/notification/create")]
router.post("/notification/create", auth("admin"), (req, res, next) => {
    notificationController.createNotification(req, res, next)
}
)
//[route("/notification")]
router.get("/notification/:userId", auth(), selfOrAdmin("userId"), (req, res, next) => {
    notificationController.getNotifications(req, res, next)
}
)
//[route("/notification/{id}")]
router.put("/notification/user/:userId/read-all", auth(), selfOrAdmin("userId"), (req, res, next) => {
    notificationController.markAllAsRead(req, res, next)
})
router.put("/notification/:id/read", auth(), async (req, res, next) => {
    try {
        if (req.user.role !== "admin") {
            const n = await prisma.notification.findUnique({ where: { id: req.params.id }, select: { userId: true } });
            if (n && n.userId !== req.user.id) return next(new ApiError(403, "That notification isn't yours."));
        }
        notificationController.markAsRead(req, res, next)
    } catch (error) {
        next(error)
    }
}
)

//division routes
router.post("/division/create", auth("admin"), (req, res, next) => {
    divisionController.createDivision(req, res, next)
})
router.get("/division", (req, res, next) => {
    divisionController.getAllDivisions(req, res, next)
})
router.get("/division/:id", (req, res, next) => {
    divisionController.getDivisionById(req, res, next)
})
router.put("/division/:id", auth("admin"), (req, res, next) => {
    divisionController.updateDivision(req, res, next)
})
router.delete("/division/:id", auth("admin"), (req, res, next) => {
    divisionController.deleteDivision(req, res, next)
})
//District routes
router.post("/district/create", auth("admin"), (req, res, next) => {
    districtController.createDistrict(req, res, next)
})
router.get("/district", (req, res, next) => {
    districtController.getAllDistricts(req, res, next)
    
})
router.get("/district/:id", (req, res, next) => {
    districtController.getDistrictById(req, res, next)
})
router.put("/district/:id", auth("admin"), (req, res, next) => {
    districtController.updateDistrict(req, res, next)
})
router.delete("/district/:id", auth("admin"), (req, res, next) => {
    districtController.deleteDistrict(req, res, next)
})

router.get("/district/by-division/:id",(req, res, next) => {
    districtController.districtByDivision(req, res, next)
})

//area
router.post("/area/create", auth("admin"), (req, res, next) => {
    areaController.createArea(req, res, next)
})
router.get("/area", areaController.getAllAreas.bind(areaController));
router.get("/area/:id", areaController.getAreaById.bind(areaController));
router.put("/area/:id", auth("admin"), areaController.updateArea.bind(areaController));
router.delete("/area/:id", auth("admin"), areaController.deleteArea.bind(areaController));
router.get("/area/by-district/:id",areaController.areaByDistrict.bind(areaController));

//-------------------Payment Routes (SSLCommerz callbacks)-----------------------
router.post("/payment/success", (req, res) => paymentController.success(req, res));
router.post("/payment/fail", (req, res) => paymentController.fail(req, res));
router.post("/payment/cancel", (req, res) => paymentController.fail(req, res));
router.post("/payment/ipn", (req, res) => paymentController.ipn(req, res));

//-------------------Contact & Newsletter Routes-----------------------
router.post("/contact/create", (req, res, next) => inboxController.createContact(req, res, next));
router.get("/contact", auth("admin"), (req, res, next) => inboxController.getContacts(req, res, next));
router.delete("/contact/:id", auth("admin"), (req, res, next) => inboxController.deleteContact(req, res, next));
router.post("/subscribe/create", (req, res, next) => inboxController.subscribe(req, res, next));
router.get("/subscriptions", auth("admin"), (req, res, next) => inboxController.getSubscribers(req, res, next));
router.delete("/subscribe/:id", auth("admin"), (req, res, next) => inboxController.deleteSubscriber(req, res, next));

//-------------------AI Trip Assistant-----------------------
router.post("/assistant/search", rateLimit({ windowMs: 60_000, max: 8 }), (req, res, next) => assistantController.search(req, res, next));

module.exports = router;
