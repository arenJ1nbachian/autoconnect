import { Box, Grid } from "@mui/material";
import carIcon from "../img/default_car_image.png";
import { useNavigate } from "react-router-dom";

const Catalog = ({ availableListings }) => {
  const navigate = useNavigate();

  const handleClick = (id) => {
    navigate(`/listings/details/${id}`);
  };

  return (
    <>
      {availableListings &&
        availableListings.map((listing) => (
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
                {availableListings && (
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
