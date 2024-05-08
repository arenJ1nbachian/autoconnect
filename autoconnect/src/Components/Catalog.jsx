import { Box, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import carIcon from "../img/default_car_image.png";
import { useNavigate } from "react-router-dom";

const Catalog = ({ selectedFilters }) => {
  const [result, setResult] = useState(undefined);
  const navigate = useNavigate();

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

    const fetchQuery = async () => {
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
        setResult(data);
        console.log(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchQuery();
  }, [selectedFilters]);

  const handleClick = (id) => {
    navigate(`/listings/details/${id}`);
  };

  return (
    <>
      {result &&
        result.queryResult.map((listing) => (
          <Grid item xs={3}>
            <Box
              onClick={() => handleClick(listing._id)}
              sx={{
                cursor: "pointer",
                marginTop: "5vh",
                position: "relative",
                borderRadius: "15px",
                border: "2px solid #0066cc",
                width: "270.5px",
                aspectRatio: "343/290",
                backgroundColor: "White",
                backgroundSize: "cover",
                padding: "20px",
              }}
            >
              <div>
                {result && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      flexDirection: "column",
                      display: "flex",

                      color: "white",
                      fontSize: "24px",
                      fontWeight: "bold",
                    }}
                  >
                    <img
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "15px",
                      }}
                      src={listing.images.length ? listing.images[0] : carIcon}
                      alt="main"
                    />
                    <div
                      style={{
                        marginTop: "1vh",
                        marginLeft: "1vw",
                        fontSize: 13,
                        display: "flex",
                        flexDirection: "column",
                        color: "black",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                        }}
                      >
                        <div>
                          {`${listing.year} ${listing.make}
                      ${listing.model}`}
                        </div>
                        <div
                          style={{
                            marginLeft: "auto",
                            marginRight: "1.5vw",
                            border: "2px solid #0066cc",
                            borderRadius: "8px",
                          }}
                        >
                          {new Intl.NumberFormat("en-US").format(
                            parseInt(listing.price)
                          ) + " $"}
                        </div>
                      </div>
                      <div style={{ height: "21px" }}>
                        {new Intl.NumberFormat("en-US").format(
                          parseInt(listing.km)
                        ) + " km"}
                      </div>
                      <div style={{ height: "21px" }}>
                        {listing.transmission}{" "}
                      </div>
                      <div
                        style={{
                          fontSize: "10px",
                          color: "grey",
                          marginLeft: "auto",
                          marginRight: "1vw",
                        }}
                      >
                        {listing._id}
                      </div>
                    </div>
                  </Box>
                )}
              </div>
            </Box>
          </Grid>
        ))}
    </>
  );
};

export default Catalog;
