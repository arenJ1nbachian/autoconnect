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
    if (searchBar) {
      navigate(`/listings/search/${searchBar}`);
    } else {
      navigate(`/listings/`);
    }
  };
  return (
    <Paper
      component="form"
      sx={{
        position: "fixed",
        top: "9%",
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
      <IconButton sx={{ p: "10px" }} aria-label="menu"></IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1, fontSize: 25 }}
        placeholder="Rechercher un véhicule ici !"
        inputProps={{ "aria-label": "search google maps" }}
        onChange={handleSearchBarChange}
      />
      <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
        <img
          src={searchIcon}
          style={{ width: 60, marginRight: 10 }}
          alt="Search Icon"
          onClick={handleSearch}
        />
      </IconButton>
    </Paper>
  );
};

export default SearchBar;
