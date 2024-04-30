const express = require("express");
const mongoose = require("mongoose");
const PORT = 5000;
const uri = "mongodb://localhost:27017/Aren";
const usersRoutes = require("./routes/users-routes");
const listingRoutes = require("./routes/listings-routes");
const textingRoutes = require("./routes/texting-routes");

const app = express();

app.use(express.json());

app.use("/api/users", usersRoutes);
app.use("/api/cars", listingRoutes);
app.use("/api/conversations", textingRoutes);

mongoose
  .connect(uri)
  .then(() => {
    app.listen(PORT);
  })
  .catch((err) => console.log(err));
