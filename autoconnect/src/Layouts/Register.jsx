import { Button, TextField, Typography } from "@mui/material";
import carIcon from "../img/carIcon.png";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    number: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState({
    firstname: "",
    lastname: "",
    email: "",
    number: "",
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const validateForm = () => {
    let errors = { email: "", password: "", username: "" };
    let isValid = true;

    if (formData.password !== formData.confirmPassword) {
      errors.password = "Les mots de passe ne sont pas identiques";
      isValid = false;
    }
    if (formData.firstname.length === 0) {
      errors.firstname = "Ce champ est requis";
      isValid = false;
    }
    if (formData.lastname.length === 0) {
      errors.lastname = "Ce champ est requis";
      isValid = false;
    }
    if (formData.email.length === 0) {
      errors.email = "Ce champ est requis";
      isValid = false;
    }
    if (formData.username.length === 0) {
      errors.username = "Ce champ est requis";
      isValid = false;
    }
    if (formData.password.length === 0) {
      errors.password = "Ce champ est requis";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = (e) => {
    validateForm();
  };
  return (
    <>
      <Typography
        sx={{
          marginTop: 9,
          fontFamily: "Cooper Black",
          color: "rgb(0,74,127)",
          fontSize: 40,
          textAlign: "center",
        }}
      >
        {"Prêt à vous lancer?"}
        <br />
        {"Remplissez le formulaire ci-dessous pour commencer !"}
      </Typography>
      <div
        style={{
          display: "flex",
          marginTop: "4vh",
          margin: "auto",
          backgroundColor: "White",
          width: "70vw",
          borderRadius: "15px",
          height: "60vh",
          border: "6px solid rgb(0,74,127)",
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
            S'inscrire
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
            {"En quelque étapes simples,"}
            <br />
            {"votre compte sera prêt en un clin d'oeil !"}
          </Typography>
          <Button
            variant="text"
            component={NavLink}
            to="/login"
            sx={{
              marginTop: 23,
              fontFamily: "Cooper Black",
              fontWeight: "bold",
              color: "rgb(0,74,127)",
              fontSize: 20,
              marginLeft: 5,
            }}
          >
            Vous avez déjà un compte ? Cliquez ici
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
            onSubmit={handleSubmit}
            style={{ display: "block", textAlign: "center", marginTop: "0px" }}
          >
            <div>
              <TextField
                label="Prénom"
                variant="standard"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                required
                margin="normal"
                error={!!formErrors.firstname}
                helperText={formErrors.firstname}
                sx={{ marginRight: "10px" }}
              />
              <TextField
                label="Nom de famille"
                variant="standard"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                required
                margin="normal"
                error={!!formErrors.lastname}
                helperText={formErrors.lastname}
              />
            </div>
            <div>
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
            <div>
              <TextField
                label="Numéro de téléphone"
                variant="standard"
                type="tel"
                name="number"
                value={formData.number}
                onChange={handleChange}
                required
                margin="normal"
                error={!!formErrors.number}
                helperText={formErrors.number}
              />
            </div>
            <div>
              <TextField
                label="Nom d'utilisateur"
                variant="standard"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                margin="normal"
                error={!!formErrors.username}
                helperText={formErrors.username}
              />
            </div>
            <div>
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
              <TextField
                label="Confirmer votre mot de passe"
                variant="standard"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                margin="normal"
                error={!!formErrors.password}
                helperText={formErrors.password}
              />
            </div>
            <Button
              onClick={handleSubmit}
              variant="contained"
              sx={{ marginTop: "20px" }}
            >
              S'inscrire
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
