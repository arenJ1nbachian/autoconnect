const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: String, required: true },
  body: { type: String, required: false },
  transmission: { type: String, required: true },
  traction: { type: String, required: false },
  seatNb: { type: String, required: false },
  fuelType: { type: String, required: false },
  fuelConsumption: { type: String, required: false },
  price: { type: String, required: true },
  km: { type: String, required: true },
  color: { type: String, required: true },
  images: [
    {
      path: { type: String, required: false },
    },
  ],
});

module.exports = mongoose.model("Listings", listingSchema);
