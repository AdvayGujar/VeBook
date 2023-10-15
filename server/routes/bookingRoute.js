// import controller
const bookingController = require("../controllers/bookingController.js");

// bookingRouter
const bookingRouter = require("express").Router();

bookingRouter.get("/allBookings", bookingController.getAllBookings);
bookingRouter.get("/getAllBooking/:user_id", bookingController.getAllBookingsByID);
bookingRouter.get("/getBookingByDateTime", bookingController.getBookingByDateTime);
bookingRouter.post("/getBookingByDateTimeVenue", bookingController.getBookingByDateTimeVenue);
bookingRouter.post("/addBooking", bookingController.addBooking);
bookingRouter.delete("/deleteBooking", bookingController.deleteBooking);
bookingRouter.delete("/deleteBooking/:id", bookingController.deleteBookingByID);

module.exports = bookingRouter;

