const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  body: { type: String, required: false },
  transmission: { type: String, required: true },
  traction: { type: String, required: false },
  seats: { type: String, required: false },
  fuelType: { type: String, required: false },
  fuelCons: { type: String, required: false },
  price: { type: Number, required: true },
  km: { type: Number, required: true },
  color: { type: String, required: true },
  images: [{ type: String, required: false }],
  userId: { type: mongoose.Types.ObjectId, required: false, ref: "Users" },
});

module.exports = mongoose.model("Listings", listingSchema);
