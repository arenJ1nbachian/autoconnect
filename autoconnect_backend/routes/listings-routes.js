const express = require("express");
const checkAuth = require("../middleware/check-auth");
const multer = require("multer");
const path = require("path");
const listingsController = require("../controllers/listings-controller");
const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"),
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.get("/", listingsController.getListings);

router.get("/:lid", listingsController.getListing);

router.use(checkAuth);

router.post("/", upload.array("images", 10), listingsController.createListing);

router.put("/:lid", listingsController.editListing);

router.delete("/:lid", listingsController.deleteListing);

module.exports = router;
