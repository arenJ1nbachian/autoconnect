import ChatBubbleRoundedIcon from "@mui/icons-material/ChatBubbleRounded";
import { Box, Button } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../Contexts/AuthContext";
import { ChatContext } from "../Contexts/ChatContext";

const Messages = () => {
  const auth = useContext(AuthContext);
  const chat = useContext(ChatContext);

  const chatBoxRef = useRef(null);
  const chatButtonRef = useRef(null);

  const [hover, setHover] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      console.log("CLICK!");

      if (
        chatBoxRef.current &&
        !chatBoxRef.current.contains(event.target) &&
        !chatButtonRef.current.contains(event.target)
      ) {
        console.log("closing chat history");
        chat.closeChatHistory();
      }
    };
    console.log("adding event listener");
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      console.log("removing event listener");

      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [chat]);

  return (
    <>
      <Button
        ref={chatButtonRef}
        onClick={() => chat.toggleChatHistory(!chat.showChatHistory)}
        sx={{
          color: "white",
          textDecoration: "none",
          marginRight: "1vw",
          padding: 0,
          fontSize: 18,
        }}
      >
        <ChatBubbleRoundedIcon />
      </Button>
      {auth.isLoggedIn && chat.showChatHistory && (
        <Box
          ref={chatBoxRef}
          position="fixed"
          sx={{
            top: "12vh",
            left: "76vw",
            flexGrow: 1,
            backgroundColor: "rgb(23,143,235)",
            zIndex: 3,
            height: "75vh",
            width: "22vw",
            boxShadow: "none",
            border: "4px solid white",
            borderTopLeftRadius: "5px",
            borderTopRightRadius: "5px",
            borderBottomLeftRadius: "25px",
            borderBottomRightRadius: "25px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",

              color: "White",
              fontSize: "30px",
              fontWeight: 700,
              marginLeft: "1vw",
              marginTop: "10px",
            }}
          >
            Chats
          </div>
          <Box
            sx={{
              backgroundColor: hover ? "rgba(255, 255, 255, 0.1)" : "",
              transition: "background-color 0.3s ease",
              cursor: "pointer",
              padding: "10px 20px",
              display: "flex",
              borderRadius: "20px",
              alignItems: "center",
              margin: "10px 0",
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <Box
              sx={{
                flexDirection: "column",
                borderRadius: "50%",
                overflow: "hidden",
                width: "50px",
                height: "50px",
              }}
            >
              <img
                src=""
                alt="Aren"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
            <div>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  color: "White",
                  fontSize: "20px",
                  fontWeight: 700,
                  marginLeft: "25px",
                }}
              >
                Aren Jinbachian
              </Box>
              <Box
                sx={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "white",
                  marginLeft: "25px",
                }}
              >
                Hey, is this Hyundai Elantra 2016 still available? 🙂
              </Box>
            </div>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Messages;
