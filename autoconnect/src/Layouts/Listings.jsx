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
  Box,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import carLogo from "../Data/carLogo.json";
import Catalog from "../Components/Catalog";
import { useLocation, useNavigate } from "react-router-dom";

const Listings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryString = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const search = useRef(decodeURIComponent(queryString.get("search") || ""));

  const [error, setError] = useState("");

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
    yearRange: [2005, new Date().getFullYear()],
  });

  const [availableListings, setAvailableListings] = useState([]);

  const getQueryParam = (param, defaultValue = "") =>
    decodeURIComponent(queryString.get(param) || defaultValue);

  useEffect(() => {
    search.current = getQueryParam("search", "");
  });

  const selectedFilters = useMemo(() => {
    const getQueryParam = (param, defaultValue = "") =>
      decodeURIComponent(queryString.get(param) || defaultValue);

    return {
      makes: getQueryParam("makes"),
      models: getQueryParam("models"),
      bodies: getQueryParam("bodies"),
      transmissions: getQueryParam("transmissions"),
      tractions: getQueryParam("tractions"),
      fuels: getQueryParam("fuels"),
      colors: getQueryParam("colors"),
      priceRange: [
        parseInt(getQueryParam("priceMin", 0), 10),
        parseInt(getQueryParam("priceMax", 100000), 10),
      ],
      kmRange: [
        parseInt(getQueryParam("kmMin", 0), 10),
        parseInt(getQueryParam("kmMax", 500000), 10),
      ],
      yearRange: [
        parseInt(getQueryParam("yearMin", 2005), 10),
        parseInt(getQueryParam("yearMax", new Date().getFullYear()), 10),
      ],
    };
  }, [queryString]);

  const updateQueryParams = (filters) => {
    const queryParams = new URLSearchParams({
      makes: filters.makes || "",
      models: filters.models || "",
      bodies: filters.bodies || "",
      transmissions: filters.transmissions || "",
      tractions: filters.tractions || "",
      fuels: filters.fuels || "",
      colors: filters.colors || "",
      priceMin: filters.priceRange[0],
      priceMax: filters.priceRange[1],
      kmMin: filters.kmRange[0],
      kmMax: filters.kmRange[1],
      yearMin: filters.yearRange[0],
      yearMax: filters.yearRange[1],
      search: search.current,
    }).toString();

    navigate(`?${queryParams}`);
  };

  const handleFilterChange =
    (field, item = "") =>
    (event) => {
      if (event.target.nodeName !== "DIV" && event.target.nodeName !== "IMG") {
        const targetValue = event.target.value || item;
        const isNewValueSelected = selectedFilters[field] !== targetValue;

        const newFilters = {
          ...selectedFilters,
          [field]: isNewValueSelected ? targetValue : "",
        };

        if (field !== "search") {
          search.current = "";
        }

        updateQueryParams(newFilters);
      }
    };

  const handleSliderChange = (field) => (event, newValue) => {
    const newFilters = {
      ...selectedFilters,
      [field]: newValue,
    };

    search.current = "";

    updateQueryParams(newFilters);
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
                </div>
              ) : (
                <div>{item}</div>
              )
            }
          />
        ))}
      </RadioGroup>
    ) : null;

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

  useEffect(() => {
    const fetchFilterData = async () => {
      const queryParams = new URLSearchParams({
        makes: selectedFilters.makes || "",
        models: selectedFilters.models || "",
        bodies: selectedFilters.bodies || "",
        transmissions: selectedFilters.transmissions || "",
        tractions: selectedFilters.tractions || "",
        fuels: selectedFilters.fuels || "",
        colors: selectedFilters.colors || "",
        priceMin: selectedFilters.priceRange[0],
        priceMax: selectedFilters.priceRange[1],
        kmMin: selectedFilters.kmRange[0],
        kmMax: selectedFilters.kmRange[1],
        yearMin: selectedFilters.yearRange[0],
        yearMax: selectedFilters.yearRange[1],
        search: search.current,
      }).toString();

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

        const data = await response.json();

        if (response.status === 202) {
          setError({ noCars: data.message });
        } else if (response.status === 404) {
          setError({ noCriteria: data.message });
        } else {
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

          setError("");
          setAvailableListings(data.listingsAvailable);
        }
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

  return error.noCars ? (
    <Box
      display="flex"
      textAlign={"center"}
      margin={"auto"}
      alignItems="center"
      height="100vh"
      width={"65vw"}
    >
      <Typography
        sx={{
          fontFamily: "Cooper Black",
          fontSize: "40px",
          color: "rgb(0,74,127)",
        }}
      >
        {error.noCars}
      </Typography>
    </Box>
  ) : (
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
        {!error.noCriteria ? (
          <Grid
            sx={{ overflow: "auto", width: "auto", height: "75vh" }}
            item
            xs={9}
          >
            <Grid container>
              <Catalog availableListings={availableListings} />
            </Grid>
          </Grid>
        ) : (
          <Grid item xs={9}>
            <Box margin={"auto"} marginTop={"15vh"} height="60vh" width="50vw">
              <Typography
                sx={{
                  fontFamily: "Cooper Black",
                  fontSize: "40px",
                  color: "rgb(0,74,127)",
                  textAlign: "center",
                }}
              >
                {error.noCriteria}
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default Listings;
