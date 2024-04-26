import { AppBar, Box, Button, Toolbar } from "@mui/material";
import { NavLink } from "react-router-dom";
import SearchBar from "./SearchBar";

const Menu = () => {
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          sx={{
            height: "11vh",
            boxShadow: "none",
            backgroundColor: "rgb(0,148,255)",
            borderBottomLeftRadius: "20%",
            borderBottomRightRadius: "20%",
          }}
        >
          <Toolbar
            sx={{ padding: "0px !important", minHeight: "80px !important" }}
          >
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
            <Button
              component={NavLink}
              to="/listings"
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
          </Toolbar>
        </AppBar>
      </Box>
      <SearchBar />
    </>
  );
};

export default Menu;
