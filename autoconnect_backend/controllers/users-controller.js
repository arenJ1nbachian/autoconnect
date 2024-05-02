const user = require("../models/user");
const Users = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await Users.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ userId: user._id }, "cleSuperSecrete", {
      expiresIn: "1h",
    });

    res.status(200).json({ token, uid: user._id });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Failed to log in" });
  }
};

const getProfile = async (req, res, next) => {
  try {
    const uid = req.params.uid;
    const user = await Users.findById({ _id: uid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.log(error);
  }
};

const editUser = async (req, res, next) => {
  const { _id, ...newData } = req.body;
  try {
    const updatedUser = await Users.findByIdAndUpdate(_id, newData, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const uid = req.params.uid;
    const user = await Users.findById({ _id: uid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await Users.findByIdAndDelete(uid);
    return res.status(200).json({ message: "User deleted!" });
  } catch (error) {
    console.log(error);
  }
};

exports.createUser = createUser;
exports.login = login;
exports.getProfile = getProfile;
exports.editUser = editUser;
exports.deleteUser = deleteUser;
