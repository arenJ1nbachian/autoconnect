const express = require("express");
const checkAuth = require("../middleware/check-auth");
const listingsController = require("../controllers/listings-controller");
const router = express.Router();

router.get("/", listingsController.getListings);

router.get("/getImagePreview/:listingId", listingsController.getImagePreview);

router.get("/:lid", listingsController.getListing);

router.get("/availableModels/:make", listingsController.getAvailableModels);

router.use(checkAuth);

router.post("/", listingsController.createListing);

router.get("/userListing/:uid", listingsController.getListingsByUserId);

router.get("/userFavorite/:uid", listingsController.getFavoritesByUserId);

router.patch("/:lid", listingsController.editListing);

router.delete("/:lid", listingsController.deleteListing);

module.exports = router;
