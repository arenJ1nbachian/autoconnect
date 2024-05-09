import { Button, Typography } from "@mui/material";
import Menu from "../Components/Menu";
import LoginIcon from "@mui/icons-material/Login";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

const Error = () => {
  const navigate = useNavigate();
  return (
    <>
      <Menu />
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          gap: "10px",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontFamily: "Cooper Black",
            fontSize: "32px",
            color: "rgb(0,74,127)",
            fontWeight: "700",
            letterSpacing: "9px",
          }}
        >
          PAGE NON TROUVÉE
        </Typography>
        <Typography
          variant="h1"
          sx={{
            fontFamily: "Cooper Black",
            fontSize: "32px",
            width: "37vw",
            color: "rgb(0,74,127)",
            textAlign: "center",
            marginBottom: "40px",
            letterSpacing: "10px",
          }}
        >
          DÉSOLÉ, NOUS N'AVONS PAS TROUVÉ CETTE PAGE.
        </Typography>
        <Typography
          variant="p"
          sx={{
            fontFamily: "Cooper Black",
            color: "rgb(0,74,127)",
            fontSize: "14px",
            width: "30vw",
            textAlign: "center",
            letterSpacing: "9px",
            marginBottom: "5vh",
          }}
        >
          PEUT-ÊTRE QUE VOUS SOUHAITEZ :
        </Typography>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "40%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Button onClick={() => navigate("/register")}>
              <AppRegistrationIcon sx={{ fontSize: 75, textAlign: "center" }} />
            </Button>
            <Typography
              variant="p"
              sx={{
                fontFamily: "Cooper Black",
                color: "rgb(0,74,127)",
                fontSize: "14px",

                textAlign: "center",
                letterSpacing: "9px",
                marginBottom: "5vh",
              }}
            >
              S'INSCRIRE
            </Typography>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Button onClick={() => navigate("/register")}>
              <SearchIcon sx={{ fontSize: 75, textAlign: "center" }} />
            </Button>
            <Typography
              variant="p"
              sx={{
                fontFamily: "Cooper Black",
                color: "rgb(0,74,127)",
                fontSize: "14px",
                width: "200px",
                textAlign: "center",
                letterSpacing: "9px",
                marginBottom: "5vh",
              }}
            >
              ACHETER UNE VOITURE
            </Typography>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Button onClick={() => navigate("/register")}>
              <LoginIcon sx={{ fontSize: 75, textAlign: "center" }} />
            </Button>
            <Typography
              variant="p"
              sx={{
                fontFamily: "Cooper Black",
                color: "rgb(0,74,127)",
                fontSize: "14px",

                textAlign: "center",
                letterSpacing: "9px",
                marginBottom: "5vh",
              }}
            >
              SE CONNECTER
            </Typography>
          </div>
        </div>
      </div>
    </>
  );
};

export default Error;
