const user = require("../models/user");
const Users = require("../models/user");
const bcrypt = require("bcrypt");

const createUser = async (req, res, next) => {
  const { firstName, lastName, email, phoneNumber, userName, password } =
    req.body;

  try {
    let existingUser = await Users.findOne({ email: email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Users({
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,
      userName: userName,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully." });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Failed to create user." });
  }
};

const login = async (req, res, next) => {};

const getProfile = async (req, res, next) => {};

const editUser = async (req, res, next) => {};

const deleteUser = async (req, res, next) => {};

exports.createUser = createUser;
exports.login = login;
exports.getProfile = getProfile;
exports.editUser = editUser;
exports.deleteUser = deleteUser;
