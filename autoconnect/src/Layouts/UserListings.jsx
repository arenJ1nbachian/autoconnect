import React, { useContext, useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import { AuthContext } from "../Contexts/AuthContext";
import { NavLink, useParams } from "react-router-dom";
import carLogo from "../Data/carLogo.json";

const UserListings = () => {
  const auth = useContext(AuthContext);
  const { userId } = useParams();
  const [listingsData, setListingsData] = useState([]);

  useEffect(() => {
    const getUserListings = async () => {
      try {
        const response = await fetch(
          process.env.REACT_APP_BACKEND_URL + "cars/userListing/" + userId,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to retrieve user listing");
        }
        const data = await response.json();
        setListingsData(data);
      } catch (error) {
        console.log(error);
      }
    };
    getUserListings();
  }, [userId, auth.token]);

  const deleteListing = async (event) => {
    const listingId = event.currentTarget.dataset.key;
    try {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "cars/" + listingId,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
          body: JSON.stringify({ userId: auth.userId }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete user listing");
      }
      setListingsData((prevListings) =>
        prevListings.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "20vh",
          backgroundColor: "White",
          width: "70vw",
          borderRadius: "15px",
          height: "70vh",
          border: "6px solid rgb(0,74,127)",
          boxShadow: "0px 4px 35px rgba(0, 74, 127, 1)",
        }}
      >
        {listingsData.length === 0 && (
          <>
            <Typography
              sx={{
                fontFamily: "Cooper Black",
                fontWeight: "bold",
                fontSize: 30,
                color: "rgb(0,74,127)",
                margin: "auto",
                textAlign: "center",
              }}
            >
              {"Oh oh, il semble que vous n'ayez pas d'annonces publiées"}
              <br />
              {
                "Cliquez sur le bouton ci-dessous pour commencer à ajouter une annonce"
              }
            </Typography>
            <Button
              component={NavLink}
              to="/listing/create"
              sx={{
                color: "white",
                backgroundColor: "red",
                borderRadius: "15px",
                width: "20vw",
                border: "2px solid red",
                fontFamily: "Cooper Black",
                fontWeight: "bold",
                fontSize: 20,
                textAlign: "center",
                margin: "auto",
                textTransform: "none",
              }}
            >
              Me diriger vers la page de création des annonces
            </Button>
          </>
        )}
        {listingsData.map((listing) => (
          <div
            key={listing._id}
            style={{
              display: "flex",
              marginLeft: "auto",
              marginRight: "auto",
              alignItems: "center",
              marginTop: "2vh",
              backgroundColor: "White",
              width: "60vw",
              borderRadius: "15px",
              height: "13vh",
              border: "4px solid rgb(0,74,127)",
            }}
          >
            <img
              src={carLogo.carLogo[listing.make]}
              alt="Car Icon"
              style={{ width: "140px", height: "80px", marginLeft: "5vw" }}
            />
            <Typography
              sx={{
                fontFamily: "Cooper Black",
                fontWeight: "bold",
                fontSize: 30,
                color: "rgb(0,74,127)",
                marginLeft: "8vw",
              }}
            >
              {`${listing.make} ${listing.model} ${listing.year}`}
            </Typography>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: "auto",
                marginRight: "4vw",
              }}
            >
              <Button
                component={NavLink}
                to={{
                  pathname: `/listing/edit/${listing._id}`,
                }}
                sx={{
                  color: "white",
                  backgroundColor: "rgb(0,148,255)",
                  borderRadius: "15px",
                  width: "10vw",
                  border: "2px solid rgb(0,148,255)",
                  fontFamily: "Cooper Black",
                  fontWeight: "bold",
                  fontSize: 20,
                  textTransform: "none",
                  margin: "5px",
                }}
              >
                Modifier
              </Button>
              <Button
                data-key={listing._id}
                onClick={deleteListing}
                sx={{
                  color: "white",
                  backgroundColor: "red",
                  borderRadius: "15px",
                  width: "10vw",
                  border: "2px solid red",
                  fontFamily: "Cooper Black",
                  fontWeight: "bold",
                  fontSize: 20,
                  textTransform: "none",
                  margin: "5px",
                }}
              >
                Supprimer
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Button
        component={NavLink}
        to={`/listing/create`}
        sx={{
          fontFamily: "Cooper Black",
          fontWeight: "bold",
          fontSize: 23,
          color: "rgb(0,74,127)",
          marginTop: "3vh",
          marginLeft: "4vw",
          textTransform: "none",
        }}
      >
        Vous souhaitez ajouter une nouvelle annonce?
      </Button>
    </>
  );
};

export default UserListings;
