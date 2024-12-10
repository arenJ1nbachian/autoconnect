import { IconButton, InputBase, Paper } from "@mui/material";
import searchIcon from "../img/searchIcon.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchBar, setSearchBar] = useState("");

  const handleSearchBarChange = (e) => {
    setSearchBar(e.target.value);
  };

  const handleSearch = () => {
    navigate({
      pathname: `/listings`,
      search: new URLSearchParams({
        makes: "",
        models: "",
        bodies: "",
        transmissions: "",
        tractions: "",
        fuels: "",
        colors: "",
        priceMin: "0",
        priceMax: "100000",
        kmMin: "0",
        kmMax: "500000",
        yearMin: "2005",
        yearMax: "2024",
        search: searchBar,
      }).toString(),
    });
  };
  return (
    <Paper
      component="form"
      sx={{
        position: "fixed",
        zIndex: 3,
        top: "7%",
        left: "50%",
        marginLeft: "-400px",
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: 850,
        height: 75,
        borderRadius: "15px",
        boxShadow: "none",
        border: "2px solid rgb(0,148,255)",
      }}
    >
      <InputBase
        sx={{ ml: 2.5, flex: 1, fontSize: 25 }}
        placeholder="Rechercher un véhicule ici !"
        inputProps={{ "aria-label": "search google maps" }}
        onChange={handleSearchBarChange}
      />
      <IconButton
        type="button"
        sx={{ p: "10px" }}
        aria-label="search"
        onClick={handleSearch}
      >
        <img
          src={searchIcon}
          style={{ width: 60, marginRight: 10 }}
          alt="Search Icon"
        />
      </IconButton>
    </Paper>
  );
};

export default SearchBar;
