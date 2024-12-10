import collection from "../img/collection.png";
import honda from "../img/honda.avif";
import hyundai from "../img/hyundai.avif";
import mazda from "../img/mazda.avif";
import { Button, Typography } from "@mui/material";
import star from "../img/stars.png";
import { NavLink } from "react-router-dom";

const Home = () => {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img src={collection} style={{ marginTop: "15vh" }} alt="Search Icon" />
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Typography
          sx={{
            fontFamily: "RGill Sans Ultra Bold",
            fontSize: 55,
            marginLeft: 35,
            textShadow: "0 0 1px black",
            lineHeight: ".95",
            transform: "scaleX(1.3)",
          }}
        >
          {"Vous souhaitez"}
          <br />
          {"vendre votre"}
          <br />
          {"voiture aujourd'hui ?"}
        </Typography>
        <Button
          component={NavLink}
          to="/register"
          variant="contained"
          sx={{
            width: 500,
            height: 100,
            marginLeft: 60,
            borderRadius: "15px",
            fontSize: 25,
            fontFamily: "RGill Sans Ultra Bold",
          }}
        >
          Cliquez ici pour commencer
        </Button>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: 70,
        }}
      >
        <img
          src={honda}
          alt="Search Icon"
          style={{ width: "400px", height: "160px" }}
        />
        <img
          src={hyundai}
          alt="Search Icon"
          style={{ width: "400px", height: "160px" }}
        />
        <img
          src={mazda}
          alt="Search Icon"
          style={{ width: "400px", height: "160px" }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: 20,
        }}
      >
        <img
          src={star}
          alt="Search Icon"
          style={{ width: "200px", height: "20px" }}
        />
        <img
          src={star}
          alt="Search Icon"
          style={{ width: "200px", height: "20px" }}
        />
        <img
          src={star}
          alt="Search Icon"
          style={{ width: "200px", height: "20px" }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: 20,
        }}
      >
        <Typography
          sx={{
            fontFamily: "RGill Sans Ultra Bold",
            color: "rgb(50,160,254)",
            textAlign: "center",
            fontSize: 18,
            transform: "scaleX(1.4)",
            marginLeft: 5,
          }}
        >
          {'"Le meilleur choix parmi'}
          <br />
          {'les voitures compactes"'}
        </Typography>
        <Typography
          sx={{
            fontFamily: "RGill Sans Ultra Bold",
            color: "rgb(50,160,254)",
            textAlign: "center",
            fontSize: 18,
            transform: "scaleX(1.4)",
          }}
        >
          {'"IIHS Top Safety Pick+'}
          <br />
          {'(meilleur choix en matière de sécurité"'}
        </Typography>
        <Typography
          sx={{
            fontFamily: "RGill Sans Ultra Bold",
            color: "rgb(50,160,254)",
            textAlign: "center",
            fontSize: 18,
            transform: "scaleX(1.4)",
          }}
        >
          {'"Grande fiabilité'}
          <br />
          {'et caractéristiques pour son temps"'}
        </Typography>
      </div>
    </>
  );
};

export default Home;
