import { Button } from "@mui/material";
import { NavLink, useParams } from "react-router-dom";

const Listings = () => {
  const { query } = useParams();

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100vw",
          height: "100vh",
          margin: "auto",
        }}
      >
        <Button
          component={NavLink}
          to="/listings/details/66392f32668bc2bf70de6746"
        >
          Direct to hyundai add
        </Button>
      </div>
    </>
  );
};

export default Listings;
