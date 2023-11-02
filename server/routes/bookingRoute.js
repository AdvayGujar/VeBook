// import controller
const bookingController = require("../controllers/bookingController.js");

// bookingRouter
const bookingRouter = require("express").Router();

bookingRouter.get("/allBookings", bookingController.getAllBookings);
bookingRouter.get("/getAllBooking/:user_id", bookingController.getAllBookingsByUserID);
bookingRouter.get("/getAllBookingsByDate/:date", bookingController.getAllBookingsByDate);
bookingRouter.get("/getBookingByDateTime", bookingController.getBookingByDateTime);
bookingRouter.get("/getBookingById/:id", bookingController.getAllBookingsByID);
bookingRouter.post("/getBookingByDateTimeVenue", bookingController.getBookingByDateTimeVenue);
bookingRouter.post("/addBooking", bookingController.addBooking);
bookingRouter.delete("/deleteBooking", bookingController.deleteBooking);
bookingRouter.delete("/deleteBooking/:id", bookingController.deleteBookingByID);
bookingRouter.delete("/pendingBooking/:id", bookingController.pendingBookingByID);

module.exports = bookingRouter;

