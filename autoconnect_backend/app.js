const express = require("express");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/bd-autoconnect";
const usersRoutes = require("./routes/users-routes");
const listingRoutes = require("./routes/listings-routes");

const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/api/users", usersRoutes);
app.use("/api/cars", listingRoutes);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    app.listen(PORT);
  })
  .catch((err) => console.log(err));
