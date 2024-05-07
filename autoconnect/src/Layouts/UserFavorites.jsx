import React, { useContext, useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import { AuthContext } from "../Contexts/AuthContext";
import { NavLink, useParams } from "react-router-dom";
import carLogo from "../Data/carLogo.json";

const UserFavorites = () => {
  const auth = useContext(AuthContext);
  const { userId } = useParams();
  const [favoritesData, setFavoritesData] = useState([]);

  useEffect(() => {
    const getUserFavorites = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/cars/userFavorite/${userId}`,
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
        setFavoritesData(data);
      } catch (error) {
        console.log(error);
      }
    };
    getUserFavorites();
  }, [userId, auth.token]);

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
        {favoritesData.length === 0 && (
          <>
            <Typography
              sx={{
                fontFamily: "Cooper Black",
                width: "50vw",
                fontWeight: "bold",
                fontSize: 30,
                color: "rgb(0,74,127)",
                margin: "auto",
                textAlign: "center",
              }}
            >
              {"Vous n'ayez pas d'annonces préférées"}
              <br />
              {
                "Pour ajouter des annonces à vos favoris, cliquez sur l'icône de sauvegarde en haut à coté du titre de l'annonce."
              }
            </Typography>
          </>
        )}
        {favoritesData.map((listing) => (
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
                to={`/listings/details/${listing._id}`}
                sx={{
                  color: "white",
                  backgroundColor: "rgb(0,148,255)",
                  borderRadius: "15px",
                  width: "15vw",
                  textAlign: "center",
                  border: "2px solid rgb(0,148,255)",
                  fontFamily: "Cooper Black",
                  fontWeight: "bold",
                  fontSize: 20,
                  textTransform: "none",
                  margin: "5px",
                }}
              >
                Consulter l'annonce
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default UserFavorites;
