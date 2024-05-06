import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { AuthContext } from "../Contexts/AuthContext";
import carBrandsData from "../Data/carBrandsData.json";
import carBrandsModelsData from "../Data/carBrandsModelsData.json";
import years from "../Data/carBrandYears.json";
import bodyType from "../Data/carBodyType.json";
import carTransmission from "../Data/carTransmission.json";
import carTraction from "../Data/carTraction.json";
import seats from "../Data/seatNumbers.json";
import fuel from "../Data/fuelTypes.json";
import fuelCons from "../Data/fuelConsumption.json";
import carColors from "../Data/carColors.json";

const CarListingCreation = ({ listingId }) => {
  const auth = useContext(AuthContext);
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    body: "",
    transmission: "",
    traction: "",
    seats: "",
    fuelType: "",
    fuelCons: "",
    price: "",
    km: "",
    color: "",
    images: [],
  });

  useEffect(() => {
    if (listingId) {
      const getUserListings = async () => {
        try {
          const response = await fetch(
            `http://localhost:5000/api/cars/${listingId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.token}`,
              },
            }
          );
          if (!response.ok) {
            throw new Error("Failed to retrieve listing");
          }
          const data = await response.json();
          setModels(carBrandsModelsData.carModelsByBrand[data.make]);
          setFormData(data);
        } catch (error) {
          console.error("Error retrieving listing:", error);
        }
      };
      getUserListings();
    }
  }, [listingId, auth.token]);

  const [models, setModels] = useState([]);

  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    if (name === "make") {
      setModels(carBrandsModelsData.carModelsByBrand[value]);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleImageChange = (event) => {
    const newImages = Array.from(event.target.files);
    const newImageStrings = [];

    newImages.forEach((image) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImageStrings.push(reader.result);

        if (newImageStrings.length === newImages.length) {
          setFormData((prevFormData) => ({
            ...prevFormData,
            images: [...prevFormData.images, ...newImageStrings],
          }));
        }
      };

      reader.readAsDataURL(image);
    });
  };

  const removeImage = (index) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      images: prevFormData.images.filter((_, i) => i !== index),
    }));
    const inputElement = document.getElementById("file-input");
    if (inputElement) {
      inputElement.value = null;
    }
  };

  const addListing = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/cars/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
        body: JSON.stringify({
          user: auth.userId,
          ...formData,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Listing created:", result);
      } else {
        throw new Error("Failed to create listing");
      }
    } catch (error) {
      console.error("Error creating listing:", error);
    }
  };

  const modifyListing = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/cars/${listingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
          body: JSON.stringify({
            ...formData,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Listing created:", result);
      } else {
        throw new Error("Failed to create listing");
      }
    } catch (error) {
      console.error("Error creating listing:", error);
    }
  };

  return (
    <Container
      style={{
        marginTop: "25vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          width: "60vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
          borderRadius: 2,
          border: "6px solid rgb(0,74,127)",
          boxShadow: "0px 4px 35px rgba(0, 74, 127, 1)",
          p: 4,
          flexDirection: "column",
        }}
      >
        {currentStep === 1 && (
          <>
            <Typography variant="h4" component="h1" gutterBottom>
              Étape 1
            </Typography>
            <Typography variant="h6" gutterBottom>
              Commençons par la marque, le modèle et l'année de votre voiture
            </Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel id="brand-label">Marque</InputLabel>
              <Select
                labelId="brand-label"
                name="make"
                value={formData.make}
                label="Marque"
                onChange={handleChange}
                sx={{
                  ".MuiSelect-select": {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  },
                }}
              >
                {carBrandsData.carBrands.map((brand) => (
                  <MenuItem key={brand} value={brand}>
                    {brand}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel id="model-label">Modèle</InputLabel>
              <Select
                labelId="model-label"
                name="model"
                label="Modèle"
                value={formData.model}
                onChange={handleChange}
              >
                {models.map((brand) => (
                  <MenuItem key={brand} value={brand}>
                    {brand}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel id="year-label">Année</InputLabel>
              <Select
                labelId="year-label"
                name="year"
                label="Année"
                value={formData.year}
                onChange={handleChange}
              >
                {years.years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        )}
        {currentStep === 2 && (
          <>
            <Typography variant="h4" component="h1" gutterBottom>
              Étape 2
            </Typography>
            <Typography variant="h6" gutterBottom>
              Précisons maintenant le type de carrosserie, la transmission et la
              traction de votre voiture.
            </Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel id="body-label">Carrosserie</InputLabel>
              <Select
                labelId="body-label"
                name="body"
                value={formData.body}
                label="Marque"
                onChange={handleChange}
                sx={{
                  ".MuiSelect-select": {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  },
                }}
              >
                {bodyType.carBodyTypes.map((body) => (
                  <MenuItem key={body} value={body}>
                    {body}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel id="transmission-label">Transmission</InputLabel>
              <Select
                labelId="transmission-label"
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                label="Modèle"
              >
                {carTransmission.transmissionTypes.map((transmission) => (
                  <MenuItem key={transmission} value={transmission}>
                    {transmission}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel id="traction-label">Traction</InputLabel>
              <Select
                labelId="traction-label"
                name="traction"
                onChange={handleChange}
                label="Année"
                value={formData.traction}
              >
                {carTraction.tractionTypes.map((traction) => (
                  <MenuItem key={traction} value={traction}>
                    {traction}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        )}
        {currentStep === 3 && (
          <>
            <Typography variant="h4" component="h1" gutterBottom>
              Étape 3
            </Typography>
            <Typography variant="h6" gutterBottom align="center">
              Détaillez maintenant les caractéristiques de performance et de
              confort de votre voiture. Veuillez sélectionner le nombre de
              sièges, le type de carburant utilisé et la consommation de
              carburant.
            </Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel id="seat-label">Nombre de sièges</InputLabel>
              <Select
                labelId="seat-label"
                name="seats"
                value={formData.seats}
                label="Nombre de sièges"
                onChange={handleChange}
                sx={{
                  ".MuiSelect-select": {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  },
                }}
              >
                {seats.seatNumbers.map((seat) => (
                  <MenuItem key={seat} value={seat}>
                    {seat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel id="fuelType-label">Type de carburant</InputLabel>
              <Select
                labelId="fuelType-label"
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                label="Type de carburant"
              >
                {fuel.fuelTypes.map((fuel) => (
                  <MenuItem key={fuel} value={fuel}>
                    {fuel}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel id="fuelCons-label">
                Consommation de Carburant
              </InputLabel>
              <Select
                labelId="fuelCons-label"
                name="fuelCons"
                onChange={handleChange}
                label="Consommation de Carburant"
                value={formData.fuelCons}
              >
                {fuelCons.fuelConsumption.map((fuelCons) => (
                  <MenuItem key={fuelCons} value={fuelCons}>
                    {fuelCons}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        )}
        {currentStep === 4 && (
          <>
            <Typography variant="h4" component="h1" gutterBottom>
              Étape 4
            </Typography>
            <Typography variant="h6" gutterBottom align="center">
              Veuillez maintenant renseigner le prix demandé, le kilométrage
              ainsi que la couleur de votre véhicule. Ces informations aideront
              les acheteurs potentiels à évaluer l'offre.
            </Typography>
            <TextField
              fullWidth
              value={formData.price}
              onChange={handleChange}
              margin="normal"
              name="price"
              label="Prix demandé"
              variant="outlined"
            />
            <TextField
              fullWidth
              value={formData.km}
              onChange={handleChange}
              margin="normal"
              name="km"
              label="Kilométrage"
              variant="outlined"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="carColor-label">Couleur</InputLabel>
              <Select
                labelId="carColor-label"
                name="color"
                onChange={handleChange}
                label="Couleur"
                value={formData.color}
              >
                {carColors.carColors.map((color) => (
                  <MenuItem key={color} value={color}>
                    {color}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        )}
        {currentStep === 5 && (
          <>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              Étape 5 - Ajouter des images de votre voiture
            </Typography>
            <Typography variant="h6" gutterBottom align="center">
              Téléchargez plusieurs images pour montrer votre voiture sous
              différents angles.
            </Typography>

            <input
              type="file"
              accept="image/*"
              multiple
              name="img"
              onChange={handleImageChange}
              style={{ display: "none" }}
              id="file-input"
            />
            <label name="img" htmlFor="file-input">
              <Button
                name="img"
                variant="contained"
                component="span"
                sx={{ mt: 2 }}
              >
                Télécharger des images
              </Button>
            </label>

            <Grid
              container
              spacing={2}
              sx={{ mt: 2 }}
              alignItems="center"
              justifyContent="center"
            >
              {console.log(formData.images)}
              {formData.images !== undefined &&
                formData?.images.map((img, index) => (
                  <Grid item key={index} xs={12} sm={6} md={4} lg={2}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "1px",
                      }}
                    >
                      <img
                        src={img}
                        alt={`Car ${index}`}
                        style={{ maxWidth: "100%", maxHeight: "80px" }}
                      />
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => removeImage(index)}
                      >
                        Remove
                      </Button>
                    </Box>
                  </Grid>
                ))}
            </Grid>
          </>
        )}
        <Box
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Button variant="outlined" color="primary" onClick={handleBack}>
            Précédent
          </Button>
          {currentStep !== 5 && (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                Suivant
              </Button>
            </>
          )}
          {currentStep === 5 && listingId && (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={modifyListing}
              >
                Finaliser
              </Button>
            </>
          )}
          {currentStep === 5 && listingId === undefined && (
            <>
              <Button variant="contained" color="primary" onClick={addListing}>
                Publier l'annonce
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Container>
  );
};
export default CarListingCreation;
