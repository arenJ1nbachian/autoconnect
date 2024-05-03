const Listings = require("../models/listing");
const Users = require("../models/user");

const createListing = async (req, res, next) => {
  try {
    const {
      user,
      make,
      model,
      year,
      body,
      transmission,
      traction,
      seats,
      fuelType,
      fuelCons,
      price,
      km,
      color,
    } = req.body;

    const files = req.files;

    const images = files.map((file) => ({
      path: file.path,
    }));

    const listing = new Listings({
      make,
      model,
      year,
      body,
      transmission,
      traction,
      seats,
      fuelType,
      fuelCons,
      price,
      km,
      color,
      images: images,
    });

    const savedListing = await listing.save();

    await Users.findByIdAndUpdate(user, {
      $push: { listings: savedListing._id },
    });

    res.status(201).json({
      message: "L'annonce a été créée avec succès",
      listing: savedListing,
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création d'une annonce" });
  }
};

const getListings = async (req, res, next) => {};

const getListing = async (req, res, next) => {};

const editListing = async (req, res, next) => {};

const deleteListing = async (req, res, next) => {};

exports.createListing = createListing;
exports.getListings = getListings;
exports.getListing = getListing;
exports.editListing = editListing;
exports.deleteListing = deleteListing;
