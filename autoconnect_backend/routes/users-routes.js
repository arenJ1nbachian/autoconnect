const express = require("express");
const checkAuth = require("../middleware/check-auth");
const { check } = require("express-validator");

const usersController = require("../controllers/users-controller");
const router = express.Router();

router.post(
  "/",
  check("firstName").not().isEmpty(),
  check("lastName").not().isEmpty(),
  check("email").not().isEmpty(),
  check("userName").not().isEmpty(),
  check("password").not().isEmpty(),
  usersController.createUser
);

router.post("/login", usersController.login);

router.get("/seller/:uid", usersController.getSellerInfo);

router.use(checkAuth);

router.get("/:uid", usersController.getProfile);

router.patch(
  "/:uid",
  check("email").not().isEmpty(),
  check("userName").not().isEmpty(),

  usersController.editUser
);

router.patch("/addFavorite/:lid", usersController.setFavorite);

router.patch("/removeFavorite/:lid", usersController.removeFavorite);

router.delete("/:uid", usersController.deleteUser);

module.exports = router;
