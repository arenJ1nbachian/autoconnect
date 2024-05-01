const express = require("express");
const checkAuth = require("../middleware/check-auth");

const usersController = require("../controllers/users-controller");
const router = express.Router();

router.post("/", usersController.createUser);

router.post("/login", usersController.login);

router.use(checkAuth);

router.get("/:uid", usersController.getProfile);

router.put("/:uid", usersController.editUser);

router.delete("/:uid", usersController.deleteUser);

module.exports = router;
