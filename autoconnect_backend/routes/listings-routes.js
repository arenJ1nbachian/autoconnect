const express = require("express");

const listingsController = require("../controllers/listings-controller");
const router = express.Router();

router.post("/", listingsController.createListing);

router.get("/", listingsController.getListings);

router.get("/:lid", listingsController.getListing);

router.put("/:lid", listingsController.editListing);

router.delete("/:lid", listingsController.deleteListing);

module.exports = router;
