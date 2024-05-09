const Listings = require("../models/listing");
const Users = require("../models/user");

const findSearchResult = (searchResult, fields) => {
  const search = searchResult.split(" ").filter((word) => word !== "");

  if (search.length > 1) {
    return {
      $or: search.map((word) => ({
        $or: fields.map((field) => ({
          [field]: { $regex: `^${word}`, $options: "i" },
        })),
      })),
    };
  }

  return {
    $or: fields.map((field) => ({
      [field]: { $regex: `^${search}`, $options: "i" },
    })),
  };
};

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
    res.status(500).json({
      error:
        "Quelque chose n'a pas fonctionné, veuillez vérifier si vous avez correctement écrit tous les champs et dans le bon format.",
    });
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
    const filters = {};

    if (req.query.makes) filters.make = { $in: req.query.makes.split(",") };
    if (req.query.models) filters.model = { $in: req.query.models.split(",") };
    if (req.query.bodies) filters.body = { $in: req.query.bodies.split(",") };
    if (req.query.transmissions)
      filters.transmission = { $in: req.query.transmissions.split(",") };
    if (req.querytractions)
      filters.traction = { $in: req.query.tractions.split(",") };
    if (req.query.fuels) filters.fuelType = { $in: req.query.fuels.split(",") };
    if (req.query.colors) filters.color = { $in: req.query.colors.split(",") };

    filters.price = {
      $gte: parseFloat(req.query.priceMin),
      $lte: parseFloat(req.query.priceMax),
    };
    filters.km = {
      $gte: parseFloat(req.query.kmMin),
      $lte: parseFloat(req.query.kmMax),
    };
    filters.year = {
      $gte: parseInt(req.query.yearMin),
      $lte: parseInt(req.query.yearMax),
    };

    let listings = await Listings.find();

    if (listings.length === 0) {
      return res.status(202).json({
        message:
          "Actuellement, il n'y a pas d'annonces de voitures disponibles. Revenez plus tard ou envisagez d'ajouter votre propre annonce !",
      });
    }

    listings = await Listings.find(filters);

    if (listings.length === 0) {
      return res.status(404).json({
        message:
          "Aucune annonce de voiture ne correspond aux critères donnés. Veuillez réessayer avec d'autres filtres ou envisagez d'ajouter votre propre annonce correspondant à ces critères spécifiques.",
      });
    }

    const query = findSearchResult(req.query.search, [
      "make",
      "model",
      "color",
      "body",
      "transmission",
      "fuelType",
    ]);

    const listingSearchQuery = await Listings.find(query);

    const getUniqueSorted = (field) => {
      const uniqueSet = new Set(listings.map((listing) => listing[field]));
      return [...uniqueSet].sort();
    };

    const makes = getUniqueSorted("make");
    const models = getUniqueSorted("model");
    const bodies = getUniqueSorted("body");
    const transmissions = getUniqueSorted("transmission");
    const tractions = getUniqueSorted("traction");
    const fuels = getUniqueSorted("fuelType");
    const colors = getUniqueSorted("color");

    const filtersAvailable = {
      makes,
      models,
      bodies,
      transmissions,
      tractions,
      fuels,
      colors,
    };

    res.json({
      filtersAvailable,
      listingsAvailable: req.query.search ? listingSearchQuery : listings,
    });
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
      .json({
        error:
          "Quelque chose n'a pas fonctionné, veuillez vérifier si vous avez correctement écrit tous les champs et dans le bon format.",
      });
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
