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
      images,
    } = req.body;

    const listing = new Listings({
      userId: user,
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

const getFavoritesByUserId = async (req, res, next) => {
  try {
    const userId = req.params.uid;
    const userWithListings = await Users.findById(userId);

    if (!userWithListings) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    const userListings = await Listings.find({
      _id: { $in: userWithListings.favorites },
    }).select("make model year");

    if (!userListings.length) {
      return res.status(404).json({
        message: "Aucune annonce favoris  n'a été trouvée pour cet utilisateur",
      });
    }
    res.json(userListings);
  } catch (error) {
    res
      .status(500)
      .json({ error: " Erreur dans la recherche d'annonces favoris" });
  }
};

const getListings = async (req, res, next) => {};

const getListing = async (req, res, next) => {
  const { lid } = req.params;
  try {
    const listing = await Listings.findById(lid);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    res.json(listing);
  } catch (error) {
    next(error);
  }
};

const editListing = async (req, res, next) => {
  const { lid } = req.params;
  const {
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
    images,
  } = req.body;

  try {
    const updatedListing = await Listings.findByIdAndUpdate(
      lid,
      {
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
        images,
      },
      { new: true }
    );

    if (!updatedListing) {
      return res.status(404).json({ message: "L'annonce n'a pas été trouvée" });
    }

    res.status(200).json({
      message: "L'annonce a été modifiée avec succès",
      listing: updatedListing,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la modification d'une annonce" });
  }
};

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
exports.getFavoritesByUserId = getFavoritesByUserId;
exports.getListing = getListing;
exports.editListing = editListing;
exports.deleteListing = deleteListing;
