const express = require("express");
const mongoose = require("mongoose");
const PORT = 5000;
const uri = "mongodb://localhost:27017/Aren";
const usersRoutes = require("./routes/users-routes");
const listingRoutes = require("./routes/listings-routes");
const textingRoutes = require("./routes/texting-routes");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST,  PATCH, DELETE");
  next();
});

app.use("/api/users", usersRoutes);
app.use("/api/cars", listingRoutes);
app.use("/api/conversations", textingRoutes);

mongoose
  .connect(uri)
  .then(() => {
    app.listen(PORT);
  })
  .catch((err) => console.log(err));
