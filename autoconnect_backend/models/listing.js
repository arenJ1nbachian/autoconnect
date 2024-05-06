const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: String, required: true },
  body: { type: String, required: false },
  transmission: { type: String, required: true },
  traction: { type: String, required: false },
  seats: { type: String, required: false },
  fuelType: { type: String, required: false },
  fuelCons: { type: String, required: false },
  price: { type: String, required: true },
  km: { type: String, required: true },
  color: { type: String, required: true },
  images: [{ type: String, required: false }],
  userId: { type: mongoose.Types.ObjectId, required: false, ref: "Users" },
});

module.exports = mongoose.model("Listings", listingSchema);
