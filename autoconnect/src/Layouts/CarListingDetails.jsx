import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../Contexts/AuthContext";
import {
  Box,
  Button,
  Grid,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import carIcon from "../img/default_car_image.png";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";

const CarListingDetails = () => {
  const { listingId } = useParams();
  const auth = useContext(AuthContext);
  const [showNumber, setShowNumber] = useState(false);
  const [clickedIndex, setClickIndex] = useState(0);
  const [message, setMessage] = useState(
    "J'aimerais savoir si votre annonce est encore disponible ?"
  );
  const [openModal, setOpenModal] = useState(false);
  const [favorite, setFavorites] = useState(false);
  const [userPublicInfo, setUserPublicInfo] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    phoneNumber: "",
  });

  const [listing, setListing] = useState({
    year: "",
    make: "",
    model: "",
    price: "",
    km: "",
    transmission: "",
    traction: "",
    body: "",
    fuelType: "",
    fuelCons: "",
    images: [],
    color: "",
    userId: "",
  });

  const handleSendMessage = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/conversations/createConvo`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
          body: JSON.stringify({
            clientId: auth.userId,
            sellerId: listing.userId,
            message: message,
            listingId: listingId,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log(result);
      } else {
        throw new Error("Failed to create listing");
      }
    } catch (err) {
      console.error("Error fetching listing:", err);
    }
  };

  const handleOpenModal = (index) => {
    setClickIndex(index);
    setOpenModal(true);
  };
  const handleCloseModal = () => setOpenModal(false);

  useEffect(() => {
    const getListing = async () => {
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

        if (response.ok) {
          const result = await response.json();
          setListing(result);
        } else {
          throw new Error("Failed to create listing");
        }
      } catch (err) {
        console.error("Error fetching listing:", err);
      }
    };

    getListing();
  }, [listingId, auth.token]);

  useEffect(() => {
    const getSeller = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/users/seller/${listing.userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          setUserPublicInfo(result);
        } else {
          throw new Error("Failed to fetch seller");
        }
      } catch (err) {
        console.error("Error fetching seller:", err);
      }
    };

    if (listing.userId) {
      getSeller();
    }
  }, [listing, auth.token]);

  useEffect(() => {
    const getFavoriteContext = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/users/${auth.userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          console.log(result);
          setFavorites(result.favorites.includes(listingId));
        } else {
          throw new Error("Failed to fetch seller");
        }
      } catch (err) {
        console.error("Error fetching seller:", err);
      }
    };
    getFavoriteContext();
  }, [auth.token, auth.userId, listingId]);

  const handleFavorite = async () => {
    favorite ? setFavorites(false) : setFavorites(true);

    try {
      favorite
        ? await fetch(
            `http://localhost:5000/api/users/removeFavorite/${listingId}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.token}`,
              },
              body: JSON.stringify({ uid: auth.userId }),
            }
          )
        : await fetch(
            `http://localhost:5000/api/users/addFavorite/${listingId}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.token}`,
              },
              body: JSON.stringify({ uid: auth.userId }),
            }
          );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="fullscreen-view"
        aria-describedby="fullscreen-view-of-picture"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Cooper Black",
              fontWeight: "bold",
              fontSize: 30,
            }}
            id="fullscreen-view"
            variant="h6"
            component="h2"
          >
            Affichage en plein écran
          </Typography>

          <img
            src={listing?.images[clickedIndex] || carIcon}
            alt="Main Car Fullscreen"
            style={{
              width: "100%",
              height: "auto",
              objectFit: "cover",
            }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              sx={{
                fontFamily: "Cooper Black",
                fontWeight: "bold",
                fontSize: 17,
              }}
              onClick={() => {
                if (clickedIndex > 0) {
                  setClickIndex(clickedIndex - 1);
                }
              }}
            >
              <ArrowBack />
            </Button>
            <Button
              sx={{
                fontFamily: "Cooper Black",
                fontWeight: "bold",
                fontSize: 17,
              }}
              onClick={() => {
                if (clickedIndex < listing.images.length - 1) {
                  setClickIndex(clickedIndex + 1);
                }
              }}
            >
              <ArrowForward />
            </Button>
          </Box>
          <Button
            sx={{
              fontFamily: "Cooper Black",
              fontWeight: "bold",
              fontSize: 17,
            }}
            onClick={handleCloseModal}
          >
            Fermer
          </Button>
        </Box>
      </Modal>
      <Box
        sx={{
          overflow: "hidden",
          width: "80%",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "16vh",
          padding: "20px 0",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Cooper Black, sans-serif",
            display: "flex",
            textAlign: "left",
            alignItems: "center",
            fontSize: "40px",
            color: "#0066cc",
            marginBottom: "20px",
            justifyContent: auth.userId !== listing.userId ? "" : "center",
            marginLeft: auth.userId !== listing.userId ? "14vw" : "",
            transform: "scaleX(1.4)",
          }}
        >
          {listing.year} {listing.make} {listing.model}
          {auth.userId !== listing.userId &&
            auth.token &&
            (favorite === true ? (
              <Button onClick={() => handleFavorite()}>
                <BookmarkIcon sx={{ fontSize: 50, textAlign: "center" }} />
              </Button>
            ) : (
              <Button onClick={() => handleFavorite()}>
                <BookmarkBorderIcon
                  sx={{ fontSize: 50, textAlign: "center" }}
                />
              </Button>
            ))}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={auth.userId !== listing.userId ? 8 : 12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: auth.userId !== listing.userId ? "" : "center",
                gap: "20px",
                marginBottom: "20px",
              }}
            >
              {listing.images.length === 0 && (
                <img
                  onClick={() => handleOpenModal(0)}
                  src={carIcon}
                  alt="Main Car "
                  style={{
                    cursor: "pointer",
                    width: "550px",
                    height: "300px",
                    marginTop: "15px",
                    marginLeft: "4vw",
                    objectFit: "cover",
                  }}
                />
              )}
              {listing.images.length > 0 && (
                <>
                  <img
                    onClick={() => handleOpenModal(0)}
                    src={listing.images ? listing.images[0] : ""}
                    alt="Main Car "
                    style={{
                      cursor: "pointer",
                      width: "550px",
                      border: "2px solid #0066cc",
                      height: "300px",
                      marginTop: "15px",
                      objectFit: "cover",
                    }}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      marginTop: "auto",
                      marginBottom: "auto",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    {listing.images.slice(1, 4).map((img, index) => (
                      <>
                        {index !== 2 && (
                          <img
                            onClick={() => handleOpenModal(index + 1)}
                            key={index}
                            src={img}
                            alt={`Side ${index + 1}`}
                            style={{
                              cursor: "pointer",
                              width: "180px",
                              height: "100px",
                              objectFit: "cover",
                              border: "2px solid #0066cc",
                            }}
                          />
                        )}
                        {index === 2 && listing.images.length > 4 && (
                          <Box
                            onClick={() => handleOpenModal(index + 1)}
                            sx={{
                              cursor: "pointer",
                              position: "relative",
                              width: "180px",
                              height: "100px",
                              border: "2px solid #0066cc",
                              backgroundImage: `url(${listing.images[3]})`,
                              backgroundSize: "cover",
                            }}
                          >
                            <Box
                              sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                backgroundColor: "rgba(0, 0, 0, 0.6)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                fontSize: "24px",
                                fontWeight: "bold",
                              }}
                            >
                              +{listing.images.length - 4}
                            </Box>
                          </Box>
                        )}
                        {index === 2 && listing.images.length <= 4 && (
                          <img
                            onClick={() => handleOpenModal(index + 1)}
                            key={index}
                            src={img}
                            alt={`Side ${index + 1}`}
                            style={{
                              cursor: "pointer",
                              width: "180px",
                              height: "100px",
                              objectFit: "cover",
                              border: "2px solid #0066cc",
                            }}
                          />
                        )}
                      </>
                    ))}
                  </Box>
                </>
              )}
            </Box>
          </Grid>
          {auth.userId !== listing.userId && (
            <Grid item xs={4}>
              <Paper
                sx={{
                  border: "2px solid #0066cc",
                  padding: "20px",
                  borderRadius: "15px",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Typography
                    sx={{
                      color: "#0066cc",
                      fontSize: "28px",
                      fontFamily: "Cooper Black, sans-serif",
                    }}
                  >
                    {userPublicInfo.firstName} {userPublicInfo.lastName}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#0066cc",
                      margin: "auto",
                      fontSize: "18px",
                      fontFamily: "Cooper Black, sans-serif",
                    }}
                  >
                    @{userPublicInfo.userName}
                  </Typography>
                </div>
                {showNumber === false ? (
                  <Button
                    onClick={() => setShowNumber(true)}
                    variant="contained"
                    sx={{
                      backgroundColor: "#0066cc",
                      color: "white",
                      borderRadius: "15px",
                      marginBottom: "10px",
                      padding: "10px",
                      width: "100%",
                    }}
                  >
                    Afficher le numéro de téléphone
                  </Button>
                ) : (
                  <Typography
                    sx={{
                      color: "#0066cc",
                      fontSize: "28px",
                      marginBottom: "10px",
                      fontFamily: "Cooper Black, sans-serif",
                    }}
                  >
                    -{userPublicInfo.phoneNumber}
                  </Typography>
                )}

                <Typography
                  variant="h6"
                  sx={{
                    color: "#0066cc",
                    fontSize: "18px",
                    marginBottom: "10px",
                    fontFamily: "Cooper Black, sans-serif",
                  }}
                >
                  Message
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  value={message}
                  minRows={4}
                  defaultValue={message}
                  onChange={(e) => setMessage(e.target.value)}
                  sx={{
                    border: "2px solid #0066cc",
                    borderRadius: "15px",
                    marginBottom: "10px",
                    resize: "none",
                  }}
                />
                <Button
                  onClick={handleSendMessage}
                  value={message}
                  variant="contained"
                  sx={{
                    backgroundColor: "#0066cc",
                    color: "white",
                    borderRadius: "15px",
                    padding: "10px",
                    width: "100%",
                  }}
                >
                  Envoyer le message
                </Button>
              </Paper>
            </Grid>
          )}
        </Grid>
        <Box sx={{ marginTop: "20px" }}>
          <Paper
            sx={{
              display: "flex",
              justifyContent: "space-around",
              padding: "15px",
              backgroundColor: "white",
              borderRadius: "15px",
              border: "2px solid #0066cc",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              marginBottom: "10px",
            }}
          >
            <Typography
              sx={{
                fontSize: "18px",
                fontFamily: "Cooper Black, sans-serif",
              }}
            >
              <strong>
                {listing.year} {listing.make} {listing.model}
              </strong>
            </Typography>
            <Typography
              sx={{
                fontSize: "18px",
                fontFamily: "Cooper Black, sans-serif",
              }}
            >
              <strong>
                {` ` +
                  new Intl.NumberFormat("en-US").format(
                    parseInt(listing.price)
                  ) +
                  " $"}
              </strong>
            </Typography>
            <Typography
              sx={{
                fontSize: "18px",
                fontFamily: "Cooper Black, sans-serif",
              }}
            >
              <strong>Voiture d'occasion</strong>
            </Typography>
            <Typography
              sx={{
                fontSize: "18px",
                fontFamily: "Cooper Black, sans-serif",
              }}
            >
              {new Intl.NumberFormat("en-US").format(parseInt(listing.km))} km
            </Typography>
            <Typography
              sx={{
                fontSize: "18px",
                fontFamily: "Cooper Black, sans-serif",
              }}
            >
              {`${listing.transmission}`}
            </Typography>
            <Typography
              sx={{
                fontSize: "18px",
                fontFamily: "Cooper Black, sans-serif",
              }}
            >
              {`${listing.traction}`}
            </Typography>
          </Paper>
          <Paper
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "15px",
              padding: "20px",
              backgroundColor: "white",
              borderRadius: "15px",
              border: "2px solid #0066cc",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography sx={{ fontSize: "18px" }}>
              <strong>Marque:</strong> {listing.make}
            </Typography>
            <Typography sx={{ fontSize: "18px" }}>
              <strong>Modèle:</strong> {listing.model}
            </Typography>
            <Typography sx={{ fontSize: "18px" }}>
              <strong>Année:</strong> {listing.year}
            </Typography>
            <Typography sx={{ fontSize: "18px" }}>
              <strong>Couleur:</strong> {listing.color}
            </Typography>
            <Typography sx={{ fontSize: "18px" }}>
              <strong>Type de carrosserie:</strong> {listing.body}
            </Typography>
            <Typography sx={{ fontSize: "18px" }}>
              <strong>Transmission:</strong> {listing.transmission}
            </Typography>
            <Typography sx={{ fontSize: "18px" }}>
              <strong>Traction:</strong> {listing.traction}
            </Typography>
            <Typography sx={{ fontSize: "18px" }}>
              <strong>Type de carburant:</strong> {listing.fuelType}
            </Typography>
            <Typography sx={{ fontSize: "18px" }}>
              <strong>Consommation de carburant:</strong> {listing.fuelCons}
            </Typography>
            <Typography sx={{ fontSize: "18px" }}>
              <strong>Kilomètres:</strong>{" "}
              {new Intl.NumberFormat("en-US").format(parseInt(listing.km))} km
            </Typography>
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default CarListingDetails;
