const db = require("../models");
const {Op} = require("sequelize");

// create main Model
const User = db.users;
const Booking = db.bookings;

// 1. create user
const addUser = async (req, res) => {
  try {
    const { name, md5Password, email, department, level } = req.body;
    let info = {
      name: name,
      password: md5Password,
      email: email,
      department: department,
      level: level,
    };

    const user = await User.create(info);
    res.status(200).send(user);
    console.log(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 2. get all users
const getAllUsers = async (req, res) => {
  let users = await User.findAll({});
  res.status(200).send(users);
};

// 3. get single user
const getOneUser = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Access the user's properties and send them in the response
    const { id, name, password, department, level } = user;

    res.status(200).json({
      id: id,
      name: name,
      email: user.email,
      password: password,
      department: department,
      level: level,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 4. update User
const updateUser = async (req, res) => {
  let id = req.params.id;

  const user = await User.update(req.body, { where: { id: id } });

  res.status(200).send(user);
};

// 5. delete user by id
const deleteUser = async (req, res) => {
  let id = req.params.id;

  await User.destroy({ where: { id: id } });

  res.status(200).send("User is deleted !");
};

// 6. connect one-to-many relation User and Bookings
const getUserBookings = async (req, res) => {
  const id = req.params.id;

  const data = await User.findOne({
    include: [
      {
        model: Booking,
        as: "booking",
      },
    ],
    where: { id: id },
  });

  res.status(200).send(data);
};

// 7. get single user by id
const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({ where: { id: id } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Access the user's properties and send them in the response
    const { name, email, password, department, level } = user;

    res.status(200).json({
      id: user.id,
      name: name,
      email: email,
      password: password,
      department: department,
      level: level,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  addUser,
  getAllUsers,
  getOneUser,
  updateUser,
  deleteUser,
  getUserBookings,
  getUserById,
};
