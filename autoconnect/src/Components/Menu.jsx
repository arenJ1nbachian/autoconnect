import { AppBar, Box, Button, Toolbar } from "@mui/material";
import { NavLink } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useContext } from "react";
import { AuthContext } from "../Contexts/AuthContext";

import Messages from "./Messages";

const Menu = () => {
  const auth = useContext(AuthContext);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="fixed"
          sx={{
            zIndex: 2,
            height: "11vh",
            boxShadow: "none",
            backgroundColor: "rgb(0,148,255)",
          }}
        >
          <Toolbar
            sx={{ padding: "0px !important", minHeight: "80px !important" }}
          >
            {!auth.isLoggedIn && (
              <Button
                component={NavLink}
                to="/register"
                sx={{
                  color: "white",
                  textDecoration: "none",
                  flexGrow: 1,
                  padding: 0,
                  fontSize: 18,
                }}
              >
                S'inscrire dès maintenant
              </Button>
            )}
            {auth.isLoggedIn && (
              <Button
                component={NavLink}
                to={`profile/${auth.userId}/favorites`}
                sx={{
                  color: "white",
                  textDecoration: "none",
                  flexGrow: 1,
                  padding: 0,
                  fontSize: 18,
                }}
              >
                Mes favoris
              </Button>
            )}
            <Button
              component={NavLink}
              to="/listings?makes=&models=&bodies=&transmissions=&tractions=&fuels=&colors=&priceMin=0&priceMax=100000&kmMin=0&kmMax=500000&yearMin=2005&yearMax=2024&search="
              sx={{
                color: "white",
                textDecoration: "none",
                flexGrow: 1,
                padding: 0,
                fontSize: 18,
              }}
            >
              Voitures d'occasion en vente
            </Button>
            {!auth.isLoggedIn && (
              <Button
                component={NavLink}
                to="/login"
                sx={{
                  color: "white",
                  textDecoration: "none",
                  flexGrow: 1,
                  padding: 0,
                  fontSize: 18,
                }}
              >
                Se connecter
              </Button>
            )}
            {auth.isLoggedIn && (
              <>
                <Button
                  component={NavLink}
                  to={`profile/${auth.userId}/settings`}
                  sx={{
                    color: "white",
                    textDecoration: "none",
                    flexGrow: 1,
                    padding: 0,
                    fontSize: 18,
                  }}
                >
                  Paramètre du compte
                </Button>
                <Button
                  onClick={auth.logout}
                  component={NavLink}
                  to={`/`}
                  sx={{
                    color: "white",
                    textDecoration: "none",
                    flexGrow: 1,
                    padding: 0,
                    fontSize: 18,
                  }}
                >
                  Déconnexion
                </Button>
              </>
            )}
          </Toolbar>
        </AppBar>
      </Box>
      <SearchBar />
      <Box sx={{ display: "flex" }}>
        <AppBar
          position="fixed"
          sx={{
            top: "7vh",
            zIndex: 2,
            height: "5vh",
            boxShadow: "none",
            backgroundColor: "rgb(0,148,255)",
          }}
        >
          <Toolbar
            sx={{
              padding: "0px !important",
              minHeight: "40px !important",
              display: "flex",
            }}
          >
            {auth.isLoggedIn && (
              <Button
                component={NavLink}
                to={`profile/${auth.userId}/listings`}
                sx={{
                  marginRight: "auto",
                  marginLeft: "10vw",
                  width: "fit-content",
                  color: "white",
                  textDecoration: "none",
                  padding: 0,
                  fontSize: 18,
                }}
              >
                Mes annonces
              </Button>
            )}

            {auth.isLoggedIn && (
              <>
                <Button
                  component={NavLink}
                  to={`listing/create`}
                  sx={{
                    marginRight: "5vw",
                    color: "white",
                    textDecoration: "none",

                    padding: 0,
                    fontSize: 18,
                  }}
                >
                  Créer une annonce
                </Button>
                <Messages />
              </>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
};

export default Menu;
