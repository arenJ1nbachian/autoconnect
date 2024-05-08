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

const getAvailableModels = async (req, res, next) => {
  try {
    const listings = await Listings.find({ make: req.params.make });

    const getUniqueSorted = (field) => {
      const uniqueSet = new Set(listings.map((listing) => listing["model"]));
      return [...uniqueSet].sort();
    };

    res.status(200).json({ models: getUniqueSorted() });
  } catch (err) {
    console.log(err);
  }
};

const getListings = async (req, res, next) => {
  try {
    if (Object.keys(req.query).length === 0) {
      const listings = await Listings.find();

      const getUniqueSorted = (field) => {
        const uniqueSet = new Set(listings.map((listing) => listing[field]));
        return [...uniqueSet].sort();
      };

      const makes = getUniqueSorted("make");
      const bodies = getUniqueSorted("body");
      const transmissions = getUniqueSorted("transmission");
      const tractions = getUniqueSorted("traction");
      const fuels = getUniqueSorted("fuelType");
      const colors = getUniqueSorted("color");

      res.status(200).json({
        makes,
        bodies,
        transmissions,
        tractions,
        fuels,
        colors,
        priceRange: [0, 100000],
        kmRange: [0, 500000],
        yearRange: [2005, new Date().getFullYear()],
      });
    } else {
      const {
        makes = "",
        models = "",
        bodies = "",
        transmissions = "",
        tractions = "",
        fuels = "",
        colors = "",
        priceMin = 0,
        priceMax = 100000,
        kmMin = 0,
        kmMax = 500000,
        yearMin = 2005,
        yearMax = new Date().getFullYear(),
      } = req.query;

      console.log(models);

      const filters = {};
      if (makes) filters.make = { $in: makes.split(",") };
      if (models) filters.model = { $in: models.split(",") };
      if (bodies) filters.body = { $in: bodies.split(",") };
      if (transmissions)
        filters.transmission = { $in: transmissions.split(",") };
      if (tractions) filters.traction = { $in: tractions.split(",") };
      if (fuels) filters.fuelType = { $in: fuels.split(",") };
      if (colors) filters.color = { $in: colors.split(",") };

      filters.price = {
        $gte: parseFloat(priceMin),
        $lte: parseFloat(priceMax),
      };
      filters.km = { $gte: parseFloat(kmMin), $lte: parseFloat(kmMax) };
      filters.year = { $gte: parseInt(yearMin), $lte: parseInt(yearMax) };

      const listings = await Listings.find(filters);

      res.status(200).json({ queryResult: listings });
    }
  } catch (err) {
    console.error("Error fetching listings", err);
    res
      .status(500)
      .json({ message: "Fetching listings failed, please try again later." });
  }
};

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
exports.getAvailableModels = getAvailableModels;
