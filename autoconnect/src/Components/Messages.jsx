import ChatBubbleRoundedIcon from "@mui/icons-material/ChatBubbleRounded";
import { Box, Button } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../Contexts/AuthContext";
import { ChatContext } from "../Contexts/ChatContext";
import Conversations from "./Conversations";

const Messages = () => {
  const auth = useContext(AuthContext);
  const chat = useContext(ChatContext);

  const chatBoxRef = useRef(null);
  const chatButtonRef = useRef(null);

  const [convoHistory, setConvoHistory] = useState({});

  const handleButtonClick = async () => {
    if (chatBoxRef) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/conversations/${auth.userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          console.log(result);
          setConvoHistory(result);
        } else {
          throw new Error("NO CONVERSATIONS EXISTS");
        }
      } catch (err) {
        console.error("Error fetching conversations:", err);
      }
    }
    chat.toggleChatHistory(!chat.showChatHistory);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        chatBoxRef.current &&
        !chatBoxRef.current.contains(event.target) &&
        !chatButtonRef.current.contains(event.target)
      ) {
        chat.closeChatHistory();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [chat]);

  return (
    <>
      <Button
        ref={chatButtonRef}
        onClick={handleButtonClick}
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
            Mes messages
          </div>
          {console.log(convoHistory)}
          <Conversations conversations={convoHistory} />
        </Box>
      )}
    </>
  );
};

export default Messages;
