import { Button, InputBase, Modal, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../Contexts/AuthContext";
import EditIcon from "@mui/icons-material/Edit";

const UserSettings = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [openModal, setOpenModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [disabledEditPhone, setDisabledEditPhone] = useState(true);
  const [disabledEditUsername, setDisabledEditUsername] = useState(true);
  const [disabledEditEmail, setDisabledEditEmail] = useState(true);
  const ariaLabel = { "aria-label": "description" };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/users/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setUserData(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserData();
  }, [userId, auth.token]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    let data = { ...userData };
    data[name] = value;
    setUserData(data);
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const deleteAccount = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      auth.logout();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const saveData = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
          body: JSON.stringify(userData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update user data");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDisabledEditEmail(true);
      setDisabledEditPhone(true);
      setDisabledEditUsername(true);
    }
  };

  return (
    <>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="delete-confirmation"
        aria-describedby="confirm-deletion-of-account"
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            border: "2px solid #000",
            boxShadow: 24,
            padding: 20,
          }}
        >
          <Typography
            sx={{
              fontFamily: "Cooper Black",
              fontWeight: "bold",
              fontSize: 30,
            }}
            id="delete-confirmation"
            variant="h6"
            component="h2"
          >
            Confirmer la suppression du compte
          </Typography>
          <Typography
            id="confirm-deletion-of-account"
            sx={{
              marginTop: 2,
              fontFamily: "Cooper Black",
              fontSize: 20,
            }}
          >
            Êtes-vous sûr de vouloir supprimer votre compte ? Cette action ne
            peut pas être annulée.
          </Typography>
          <Button
            sx={{
              fontFamily: "Cooper Black",
              fontWeight: "bold",
              fontSize: 17,
            }}
            onClick={() => {
              deleteAccount();
            }}
            color="error"
          >
            Delete
          </Button>
          <Button
            sx={{
              fontFamily: "Cooper Black",
              fontWeight: "bold",
              fontSize: 17,
            }}
            onClick={handleCloseModal}
          >
            Cancel
          </Button>
        </div>
      </Modal>
      <div
        style={{
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "25vh",
          backgroundColor: "White",
          width: "60vw",
          borderRadius: "15px",
          height: "60vh",
          border: "6px solid rgb(0,74,127)",
          boxShadow: "0px 4px 35px rgba(0, 74, 127, 1)",
        }}
      >
        <div
          style={{
            display: "flex",
            marginLeft: "6vw",
            fontFamily: "Cooper Black",
            fontWeight: "bold",
            fontSize: 30,
            marginTop: "2vh",
          }}
        >
          <Typography
            sx={{
              marginTop: 5,
              fontFamily: "Cooper Black",
              fontWeight: "bold",
              fontSize: 30,
            }}
          >
            {"Données personnelles"}
          </Typography>
          {!disabledEditEmail || !disabledEditPhone || !disabledEditUsername? (
            <Typography
              sx={{
                marginTop: 5,
                color: "red",
                marginLeft: "auto",
                marginRight: "2vw",
                fontFamily: "Cooper Black",
                fontWeight: "bold",
                fontSize: 15,
              }}
            >
              {"Appuyez sur le champ à côté du bouton"} <br />
              {"pour commencer à modifier la valeur!"}
            </Typography>
          ) : (
            <></>
          )}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: "2vh",
          }}
        >
          <Typography
            sx={{
              marginTop: 5,
              marginLeft: 5,
              fontFamily: "Cooper Black",
              fontWeight: "bold",
              fontSize: 30,
            }}
          >
            {"Prénom"}
            <br />
            <div style={{ fontSize: 25 }}>{userData?.firstName}</div>
          </Typography>
          <Typography
            sx={{
              marginTop: 5,
              marginLeft: 25,
              fontFamily: "Cooper Black",
              fontWeight: "bold",
              fontSize: 30,
            }}
          >
            {"Nom"}
            <br />
            <div style={{ fontSize: 25 }}>{userData?.lastName}</div>
          </Typography>
          <Typography
            sx={{
              marginTop: 5,
              marginLeft: 25,
              fontFamily: "Cooper Black",
              fontWeight: "bold",
              fontSize: 30,
            }}
          >
            {"Numéro de Téléphone"}
            <br />
            <div style={{ fontSize: 25 }}>
              {disabledEditPhone ? (
                <InputBase
                  name="phoneNumber"
                  disabled
                  sx={{
                    fontFamily: "Cooper Black",
                    fontWeight: "bold",
                    fontSize: 25,
                    color: "black",
                  }}
                  value={userData?.phoneNumber}
                  inputProps={ariaLabel}
                />
              ) : (
                <InputBase
                  name="phoneNumber"
                  onChange={handleChange}
                  sx={{
                    fontFamily: "Cooper Black",
                    fontWeight: "bold",
                    fontSize: 25,
                    color: "rgb(255, 91, 97)",
                  }}
                  value={userData?.phoneNumber}
                  inputProps={ariaLabel}
                />
              )}

              <Button onClick={() => setDisabledEditPhone(false)}>
                <EditIcon sx={{ color: "black" }} />
              </Button>
            </div>
          </Typography>
        </div>
        <div
          style={{
            marginLeft: "6vw",
            fontFamily: "Cooper Black",
            fontWeight: "bold",
            fontSize: 30,
            marginTop: "2vh",
          }}
        >
          <Typography
            sx={{
              marginTop: 5,
              fontFamily: "Cooper Black",
              fontWeight: "bold",
              fontSize: 30,
            }}
          >
            {"Paramètres du compte"}
          </Typography>
        </div>
        <div style={{ display: "flex" }}>
          <Typography
            sx={{
              marginTop: 5,
              marginLeft: "2vw",
              fontFamily: "Cooper Black",
              fontWeight: "bold",
              fontSize: 30,
            }}
          >
            {"Email"}
            <br />
            <div style={{ fontSize: 25 }}>
              {disabledEditEmail ? (
                <InputBase
                  name="email"
                  disabled
                  sx={{
                    fontFamily: "Cooper Black",
                    fontWeight: "bold",
                    fontSize: 25,
                    color: "black",
                    width: "20vw",
                  }}
                  value={userData?.email}
                  inputProps={ariaLabel}
                />
              ) : (
                <InputBase
                  name="email"
                  onChange={handleChange}
                  sx={{
                    width: "20vw",
                    fontFamily: "Cooper Black",
                    fontWeight: "bold",
                    fontSize: 25,
                    color: "rgb(255, 91, 97)",
                  }}
                  value={userData?.email}
                  inputProps={ariaLabel}
                />
              )}

              <Button onClick={() => setDisabledEditEmail(false)}>
                <EditIcon sx={{ color: "black" }} />
              </Button>
            </div>
          </Typography>
          <Typography
            sx={{
              marginTop: 5,
              marginLeft: "2vw",
              fontFamily: "Cooper Black",
              fontWeight: "bold",
              fontSize: 30,
            }}
          >
            {"Nom d'utilisateur"}
            <br />
            <div style={{ fontSize: 25 }}>
              {disabledEditUsername ? (
                <InputBase
                  name="userName"
                  disabled
                  sx={{
                    fontFamily: "Cooper Black",
                    fontWeight: "bold",
                    fontSize: 25,
                    color: "black",
                    width: "20vw",
                  }}
                  value={userData?.userName}
                  inputProps={ariaLabel}
                />
              ) : (
                <InputBase
                  name="userName"
                  onChange={handleChange}
                  sx={{
                    width: "20vw",
                    fontFamily: "Cooper Black",
                    fontWeight: "bold",
                    fontSize: 25,
                    color: "rgb(255, 91, 97)",
                  }}
                  value={userData?.userName}
                  inputProps={ariaLabel}
                />
              )}

              <Button onClick={() => setDisabledEditUsername(false)}>
                <EditIcon sx={{ color: "black" }} />
              </Button>
            </div>
          </Typography>
        </div>

        <Typography
          component={Button}
          onClick={handleOpenModal}
          sx={{
            color: "red",
            marginTop: 5,
            marginLeft: "2vw",
            fontFamily: "Cooper Black",
            fontWeight: "bold",
            fontSize: 30,
            textTransform: "none",
          }}
        >
          {"Supprimer mon compte"}
        </Typography>

        {!disabledEditEmail || !disabledEditPhone || !disabledEditUsername ? (
          <Typography
            component={Button}
            onClick={saveData}
            sx={{
              color: "rgb(255, 91, 97)",
              marginTop: 5,
              marginLeft: "10vw",
              fontFamily: "Cooper Black",
              fontWeight: "bold",
              fontSize: 30,
              textTransform: "none",
            }}
          >
            {"Sauvegarder les changements"}
          </Typography>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};
export default UserSettings;
