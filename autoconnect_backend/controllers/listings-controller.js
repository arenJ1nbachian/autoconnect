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

const getListingsByUserId = async (req, res, next) => {
  try {
    const userId = req.params.uid;
    const userWithListings = await Users.findById(userId);

    if (!userWithListings) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    const userListings = await Listings.find({
      _id: { $in: userWithListings.listings },
    }).select("make model year");

    if (!userListings.length) {
      return res.status(404).json({
        message: "Aucune annonce n'a été trouvée pour cet utilisateur",
      });
    }
    res.json(userListings);
  } catch (error) {
    res.status(500).json({ error: " Erreur dans la recherche d'annonces" });
  }
};

const getListings = async (req, res, next) => {};

const getListing = async (req, res, next) => {};

const editListing = async (req, res, next) => {};

const deleteListing = async (req, res, next) => {
  try {
    const listingId = req.params.lid;

    const userId = req.body.userId;

    const deletedListing = await Listings.findByIdAndDelete(listingId);

    await Users.updateOne({ _id: userId }, { $pull: { listings: listingId } });

    if (!deletedListing) {
      return res
        .status(404)
        .json({ message: "Aucune annonce n'a été trouvée " });
    }
    res.status(200).json({ message: "Suppression réussie de l'annonce" });
  } catch (error) {
    res.status(500).json({ error: "Échec de la suppression de l'inscription" });
  }
};

exports.createListing = createListing;
exports.getListings = getListings;
exports.getListingsByUserId = getListingsByUserId;
exports.getListing = getListing;
exports.editListing = editListing;
exports.deleteListing = deleteListing;
