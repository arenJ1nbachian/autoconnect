const express = require("express");
const checkAuth = require("../middleware/check-auth");

const listingsController = require("../controllers/listings-controller");
const router = express.Router();

router.get("/", listingsController.getListings);

router.get("/:lid", listingsController.getListing);

router.use(checkAuth);

router.post("/", listingsController.createListing);

router.put("/:lid", listingsController.editListing);

router.delete("/:lid", listingsController.deleteListing);

module.exports = router;
