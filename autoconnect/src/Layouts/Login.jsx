import { Button, TextField, Typography } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import carIcon from "../img/carIcon.png";
import { useState } from "react";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const validateForm = () => {
    let errors = { email: "", password: "" };
    let isValid = true;

    if (formData.email.length === 0) {
      errors.email = "Ce champ est requis";
      isValid = false;
    }

    if (formData.password.length === 0) {
      errors.password = "Ce champ est requis";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    if (validateForm()) {
      try {
        const res = await fetch("http://localhost:5000/api/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          navigate("/listings");
        }
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  return (
    <>
      <Typography
        sx={{
          paddingTop: 22,
          marginBottom: 3,
          fontFamily: "Cooper Black",
          color: "rgb(0,74,127)",
          fontSize: 40,
          textAlign: "center",
        }}
      >
        {"Connectez-vous à l'aide de votre adresse e-mail et "}
        <br />
        {"de votre mot de passe"}
      </Typography>
      <div
        style={{
          display: "flex",
          marginTop: "3vh",
          margin: "auto",
          backgroundColor: "White",
          width: "70vw",
          borderRadius: "15px",
          height: "60vh",
          border: "6px solid rgb(0,74,127)",
          boxShadow: "0px 4px 35px rgba(0, 74, 127, 1)",
        }}
      >
        <div>
          <img
            src={carIcon}
            style={{ width: 100, height: 100, marginLeft: 50, marginTop: 20 }}
            alt="carIcon"
          />
          <Typography
            sx={{
              marginTop: 5,
              fontFamily: "Arial",
              fontWeight: "bold",
              color: "black",
              fontSize: 40,
              marginLeft: 25,
            }}
          >
            Se connecter
          </Typography>
          <Typography
            sx={{
              marginTop: 5,
              fontFamily: "Arial",
              fontWeight: "bold",
              color: "grey",
              fontSize: 20,
              marginLeft: 30,
              transform: "scaleX(1.2)",
            }}
          >
            {"Connectez-vous !"}
            <br />
            {"Entrez vos informaitons pour commencer"}
          </Typography>
          <Button
            variant="text"
            component={NavLink}
            to="/register"
            sx={{
              marginTop: 23,
              fontFamily: "Cooper Black",
              fontWeight: "bold",
              color: "rgb(0,74,127)",
              fontSize: 20,
              marginLeft: 5,
            }}
          >
            Vous n'avez pas de compte ? Cliquez ici
          </Button>
        </div>
        <div
          style={{
            margin: "auto",
            marginLeft: "130px",
            marginTop: "25px",
            backgroundColor: "White",
            width: "27vw",
            borderRadius: "15px",
            height: "55vh",
            border: "2px solid black",
            boxShadow: "0px 4px 25px rgba(0, 0, 0, 0.5)",
          }}
        >
          <form
            style={{
              display: "block",
              textAlign: "center",
            }}
          >
            <div style={{ marginTop: "100px", marginBottom: "35px" }}>
              <TextField
                label="Adresse courriel"
                variant="standard"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                margin="normal"
                error={!!formErrors.email}
                helperText={formErrors.email}
              />
            </div>
            <div style={{ marginBottom: "75px" }}>
              <TextField
                label="Mot de passe"
                variant="standard"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                margin="normal"
                error={!!formErrors.password}
                helperText={formErrors.password}
                sx={{ marginRight: "10px" }}
              />
            </div>

            <Button
              onClick={handleSubmit}
              variant="contained"
              sx={{ marginTop: "20px" }}
            >
              Se connecter
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
