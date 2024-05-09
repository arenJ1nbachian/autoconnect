import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
  Slider,
  Grid,
} from "@mui/material";
import { useEffect, useState } from "react";
import carLogo from "../Data/carLogo.json";
import Catalog from "../Components/Catalog";

const Listings = () => {
  const [selectedFilters, setSelectedFilters] = useState({
    makes: "",
    models: "",
    bodies: "",
    transmissions: "",
    tractions: "",
    fuels: "",
    colors: "",
    priceRange: [0, 100000],
    kmRange: [0, 500000],
    yearRange: [2005, new Date().getFullYear()],
  });

  const [filterData, setFilterData] = useState({
    makes: [],
    models: [],
    bodies: [],
    transmissions: [],
    tractions: [],
    fuels: [],
    colors: [],
    priceRange: [0, 100000],
    kmRange: [0, 500000],
    yearRange: [1990, new Date().getFullYear()],
  });

  const [availableListings, setAvailableListings] = useState([]);

  useEffect(() => {
    const {
      makes,
      models,
      bodies,
      transmissions,
      tractions,
      fuels,
      colors,
      priceRange = [0, 100000],
      kmRange = [0, 500000],
      yearRange = [2005, new Date().getFullYear()],
    } = selectedFilters;

    const queryParams = new URLSearchParams({
      makes: makes ? makes : "",
      models: models ? models : "",
      bodies: bodies ? bodies : "",
      transmissions: transmissions ? transmissions : "",
      tractions: tractions ? tractions : "",
      fuels: fuels ? fuels : "",
      colors: colors ? colors : "",
      priceMin: priceRange[0],
      priceMax: priceRange[1],
      kmMin: kmRange[0],
      kmMax: kmRange[1],
      yearMin: yearRange[0],
      yearMax: yearRange[1],
    }).toString();

    const fetchFilterData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/cars/?${queryParams}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch filter data");

        const data = await response.json();
        console.log(data);
        setFilterData((prev) => ({
          ...prev,
          makes: data.filtersAvailable.makes,
          models: data.filtersAvailable.models,
          bodies: data.filtersAvailable.bodies,
          transmissions: data.filtersAvailable.transmissions,
          tractions: data.filtersAvailable.tractions,
          fuels: data.filtersAvailable.fuels,
          colors: data.filtersAvailable.colors,
        }));
        setAvailableListings(data.listingsAvailable);
        console.log(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFilterData();
  }, [selectedFilters]);

  useEffect(() => {
    const fetchFilteredModels = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/cars/availableModels/${selectedFilters.makes}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch filter data");

        const data = await response.json();
        setFilterData((prev) => ({
          ...prev,
          models: data.models,
        }));
      } catch (err) {
        console.error(err);
      }
    };
    if (selectedFilters.makes !== "") {
      fetchFilteredModels();
    }
  }, [selectedFilters.makes]);

  const handleFilterChange =
    (field, item = "") =>
    (event) => {
      const targetValue = event.target.value || item;
      console.log("Changing field", field);
      /* La balise div entourant l'input déclenche son propre événement, suivi de celui de l'input.
       Nous nous intéressons uniquement à l'événement de l'input, car il contient target.value
      pour mettre à jour l'état de selectedFilters. Ignorer l'événement du div évite les
       problèmes de mise à jour d'état qui pourraient entraîner des erreurs de filtrage.

       Cliquer sur le div devrait également avoir le même effet que cliquer sur le bouton radio. */

      console.log(event);

      if (event.target.nodeName !== "DIV" && event.target.nodeName !== "IMG") {
        if (field === "makes") {
          selectedFilters["makes"] === targetValue &&
            setSelectedFilters((prev) => ({ ...prev, models: "" }));
        }
        setSelectedFilters((prev) => ({
          ...prev,
          [field]: prev[field] === targetValue ? "" : targetValue,
        }));
      }
    };

  const renderRadioGroup = (field, items, logo = false) =>
    filterData[field] ? (
      <RadioGroup
        value={selectedFilters[field] || ""}
        onClick={handleFilterChange(field)}
      >
        {items.map((item) => (
          <FormControlLabel
            key={item}
            value={item}
            control={<Radio />}
            label={
              logo && carLogo.carLogo[item] ? (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      onClick={handleFilterChange(field, item)}
                      style={{ width: "50px", marginRight: "8px" }}
                      alt={item}
                      src={carLogo.carLogo[item]}
                    />
                    {item}
                  </div>
                  {selectedFilters.makes !== "" &&
                    filterData.models !== undefined &&
                    filterData.models.length > 0 &&
                    item === selectedFilters.makes && (
                      <RadioGroup
                        value={selectedFilters["models"] || ""}
                        onClick={(e) => {
                          handleFilterChange("models");
                        }}
                        sx={{ marginLeft: "20px", marginTop: "10px" }}
                      ></RadioGroup>
                    )}
                </div>
              ) : (
                <div>{item}</div>
              )
            }
          />
        ))}
      </RadioGroup>
    ) : (
      console.log(filterData)
    );

  const handleSliderChange = (field) => (event, newValue) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [field]: newValue,
    }));
  };

  const renderSlider = (field, min, max, step = 1, label = "Slider") => (
    <Slider
      value={selectedFilters[field]}
      onChange={handleSliderChange(field)}
      valueLabelDisplay="auto"
      min={min}
      max={max}
      step={step}
      disableSwap
      getAriaLabel={() => label}
    />
  );

  return (
    <>
      <Typography
        sx={{
          fontFamily: "Cooper Black",
          fontSize: "40px",
          color: "rgb(0,74,127)",
        }}
        mt={20}
        ml={10}
      >
        Voiture d'occasion
      </Typography>
      <Grid container direction="row" justifyContent="center" spacing={2}>
        <Grid item xs={3}>
          <Card
            sx={{
              marginLeft: "4vw",
              marginTop: "3vh",
              width: 350,
              height: 637,
              overflowY: "auto",
              borderRadius: 7,
            }}
          >
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1-content"
                id="panel1-header"
                sx={{
                  minHeight: "60px",
                  "& .MuiAccordionSummary-content": {
                    margin: "12px 0",
                  },
                }}
              >
                Marque
              </AccordionSummary>
              <AccordionDetails>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {renderRadioGroup("makes", filterData.makes, true)}
                </div>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel1-content"
                id="panel1-header"
                sx={{
                  minHeight: "60px",
                  "& .MuiAccordionSummary-content": {
                    margin: "12px 0",
                  },
                }}
              >
                Modèle
              </AccordionSummary>
              <AccordionDetails>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {selectedFilters.makes !== "" &&
                    filterData.models !== undefined &&
                    filterData.models.length > 0 && (
                      <>
                        {filterData.models.map((model) => (
                          <RadioGroup
                            onClick={handleFilterChange("models")}
                            value={selectedFilters["models"] || ""}
                          >
                            <FormControlLabel
                              sx={{ marginLeft: "5px" }}
                              key={model}
                              value={model}
                              control={<Radio size="small" />}
                              label={
                                <div
                                  style={{
                                    fontSize: 15,
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  {model}
                                </div>
                              }
                            />
                          </RadioGroup>
                        ))}
                      </>
                    )}
                </div>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel2-content"
                id="panel2-header"
                sx={{
                  minHeight: "60px",
                  "& .MuiAccordionSummary-content": {
                    margin: "12px 0",
                  },
                }}
              >
                Carrosserie
              </AccordionSummary>
              <AccordionDetails>
                {renderRadioGroup("bodies", filterData.bodies)}
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel3-content"
                id="panel3-header"
                sx={{
                  minHeight: "60px",
                  "& .MuiAccordionSummary-content": {
                    margin: "12px 0",
                  },
                }}
              >
                Prix
              </AccordionSummary>
              <AccordionDetails>
                {renderSlider(
                  "priceRange",
                  filterData.priceRange[0],
                  filterData.priceRange[1],
                  1000,
                  "Price"
                )}
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel4-content"
                id="panel4-header"
                sx={{
                  minHeight: "60px",
                  "& .MuiAccordionSummary-content": {
                    margin: "12px 0",
                  },
                }}
              >
                Km
              </AccordionSummary>
              <AccordionDetails>
                {renderSlider(
                  "kmRange",
                  filterData.kmRange[0],
                  filterData.kmRange[1],
                  1000,
                  "Km"
                )}
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel5-content"
                id="panel5-header"
                sx={{
                  minHeight: "60px",
                  "& .MuiAccordionSummary-content": {
                    margin: "12px 0",
                  },
                }}
              >
                Année
              </AccordionSummary>
              <AccordionDetails>
                {renderSlider(
                  "yearRange",
                  filterData.yearRange[0],
                  filterData.yearRange[1],
                  1,
                  "Year"
                )}
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel6-content"
                id="panel6-header"
                sx={{
                  minHeight: "60px",
                  "& .MuiAccordionSummary-content": {
                    margin: "12px 0",
                  },
                }}
              >
                Transmission
              </AccordionSummary>
              <AccordionDetails>
                {renderRadioGroup("transmissions", filterData.transmissions)}
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel7-content"
                id="panel7-header"
                sx={{
                  minHeight: "72.2px",
                  "& .MuiAccordionSummary-content": {
                    margin: "12px 0",
                  },
                }}
              >
                Traction
              </AccordionSummary>
              <AccordionDetails>
                {renderRadioGroup("tractions", filterData.tractions)}
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel8-content"
                id="panel8-header"
                sx={{
                  minHeight: "72.2px",
                  "& .MuiAccordionSummary-content": {
                    margin: "12px 0",
                  },
                }}
              >
                Carburant
              </AccordionSummary>
              <AccordionDetails>
                {renderRadioGroup("fuels", filterData.fuels)}
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel9-content"
                id="panel9-header"
                sx={{
                  minHeight: "72.2px",
                  "& .MuiAccordionSummary-content": {
                    margin: "12px 0",
                  },
                }}
              >
                Couleur
              </AccordionSummary>
              <AccordionDetails>
                {renderRadioGroup("colors", filterData.colors)}
              </AccordionDetails>
            </Accordion>
          </Card>
        </Grid>

        <Grid
          sx={{ overflow: "auto", width: "auto", height: "75vh" }}
          item
          xs={9}
        >
          <Grid container>
            <Catalog availableListings={availableListings} />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Listings;
