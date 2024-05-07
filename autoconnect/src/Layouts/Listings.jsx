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
    bodies: [],
    transmissions: [],
    tractions: [],
    fuels: [],
    colors: [],
    priceRange: [0, 100000],
    kmRange: [0, 500000],
    yearRange: [1990, new Date().getFullYear()],
  });

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/cars/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch filter data");

        const data = await response.json();
        setFilterData(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFilterData();
  }, []);

  const handleFilterChange = (field) => (event) => {
    console.log(event);
    if (event.target.nodeName !== "DIV") {
      setSelectedFilters((prev) => ({
        ...prev,
        [field]: prev[field] === event.target.value ? "" : event.target.value,
      }));
    }
  };

  const renderRadioGroup = (field, items, logo = false) => (
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
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  style={{ width: "50px", marginRight: "8px" }}
                  alt={item}
                  src={carLogo.carLogo[item]}
                />
                {item}
              </div>
            ) : (
              item
            )
          }
        />
      ))}
    </RadioGroup>
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
              height: 650,
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
                  minHeight: "72.2px",
                  "& .MuiAccordionSummary-content": {
                    margin: "12px 0",
                  },
                }}
              >
                Marque et Modèle
              </AccordionSummary>
              <AccordionDetails>
                {renderRadioGroup("makes", filterData.makes, true)}
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMore />}
                aria-controls="panel2-content"
                id="panel2-header"
                sx={{
                  minHeight: "72.2px",
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
                  minHeight: "72.2px",
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
                  minHeight: "72.2px",
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
                  minHeight: "72.2px",
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
                  minHeight: "72.2px",
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
            <Catalog selectedFilters={selectedFilters} />
          </Grid>
        </Grid>
      </Grid>

      {console.log("What is selected", selectedFilters)}
    </>
  );
};

export default Listings;
