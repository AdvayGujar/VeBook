const db = require("../models");

// model
const Booking = db.bookings;

//1. Add Booking
const addBooking = async (req, res) => {
  try {
    const { user_id, venue_id, level, date, start_time, end_time, status } =
      req.body;
    let data = {
      user_id: user_id,
      venue_id: venue_id,
      level: level,
      date: date,
      start_time: start_time,
      end_time: end_time,
      status: status,
    };

    const booking = await Booking.create(data);
    res.status(200).send(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 2. Get All Bookings
const getAllBookings = async (req, res) => {
  const bookings = await Booking.findAll({});
  res.status(200).send(bookings);
};

const getAllBookingsByID = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const bookings = await Booking.findAll({ where: { user_id: user_id } });

    if (bookings.length === 0) {
      return res.status(400).json({ error: "No bookings found" });
    }

    const bookingList = bookings.map((booking) => {
      return {
        id: booking.id,
        venue_id: booking.venue_id,
        date: booking.date,
        start_time: booking.start_time,
        end_time: booking.end_time,
        status: booking.status,
      };
    });

    res.status(200).json(bookingList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getBookingByDateTimeVenue = async (req, res) => {
  try {
    const { date, start_time, end_time, venue_id } = req.body;
    const booking = await Booking.findOne({
      where: {
        date: date,
        venue_id: venue_id,
        [Op.or]: [
          {
            [Op.and]: [
              { start_time: { [Op.gte]: start_time } }, // Case 1
              { end_time: { [Op.lte]: end_time } }, // Case 1
            ],
          },
          {
            [Op.and]: [
              { start_time: { [Op.lt]: start_time } }, // Case 1
              { end_time: { [Op.gt]: end_time } }, // Case 1
            ],
          },
          {
            [Op.and]: [
              { start_time: { [Op.lt]: start_time } }, // Case 2
              { end_time: { [Op.lte]: end_time } }, // Case 2
              { end_time: { [Op.gt]: start_time } }, // Case 2
            ],
          },
          {
            [Op.and]: [
              { start_time: { [Op.gte]: start_time } }, // Case 3
              { start_time: { [Op.lt]: end_time } }, // Case 3
              { end_time: { [Op.gt]: end_time } }, // Case 3
            ],
          },
        ],
      },
    });

    if (!booking) {
      return res.status(400).json({ error: "Booking not found" });
    }

    const { id, user_id, level, status } = booking;

    res.status(200).json({
      id: id,
      user_id: user_id,
      venue_id: booking.venue_id,
      level: level,
      date: booking.date,
      start_time: booking.start_time,
      end_time: booking.end_time,
      status: status,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getBookingByDateTime = async (req, res) => {
  const { booking_date, time } = req.body;
  const booking = await Booking.findOne({
    where: { date: booking_date, start_time: time },
  });
  res.status(200).send(booking);
};

const deleteBooking = async (req, res) => {
  try {
    const { date, start_time, venue_id } = req.body;
    const booking = await Booking.findOne({
      where: { date: date, start_time: start_time, venue_id: venue_id },
    });

    booking.status = 0;
    await booking.save();

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const deleteBookingByID = async (req, res) => {
  try {
    const id = req.params.id;
    const booking = await Booking.findOne({ where: { id: id } });

    booking.status = 0;
    await booking.save();

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  addBooking,
  getAllBookings,
  getAllBookingsByID,
  getBookingByDateTimeVenue,
  getBookingByDateTime,
  deleteBooking,
  deleteBookingByID,
};
