import { Box, Typography } from "@mui/material";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Contexts/AuthContext";

const Conversations = ({ conversations = "" }) => {
  const auth = useContext(AuthContext);
  const [conversationInfo, setConversationInfo] = useState([]);

  useEffect(() => {
    const fetchInteractedUsersInfo = async () => {
      try {
        if (
          !conversations.conversations ||
          conversations.conversations.length === 0
        ) {
          return;
        }
        const fetchedConversations = await Promise.all(
          conversations.conversations.map(async (conversation) => {
            const userResponse = await fetch(
              auth.userId === conversation.participants[0]
                ? `http://localhost:5000/api/users/seller/${conversation.participants[1]}`
                : `http://localhost:5000/api/users/seller/${conversation.participants[0]}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${auth.token}`,
                },
              }
            );
            if (!userResponse.ok) {
              throw new Error("Failed to fetch user data");
            }
            const user = await userResponse.json();

            const messageResponse = await fetch(
              `http://localhost:5000/api/conversations/messages/${conversation.lastMessage}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${auth.token}`,
                },
              }
            );
            if (!messageResponse.ok) {
              throw new Error(
                `Failed to fetch message data for messageId: ${conversation.lastMessage}`
              );
            }
            const message = await messageResponse.json();

            const imageResponse = await fetch(
              `http://localhost:5000/api/cars/getImagePreview/${conversation.listingId}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${auth.token}`,
                },
              }
            );

            if (!imageResponse.ok) {
              throw new Error(`Failed to fetch image data `);
            }

            const image = await imageResponse.json();

            return {
              fullName: user.firstName.concat(" ", user.lastName),
              messagePreview: message.message.content,
              conversationId: conversation._id,
              imagePreview: image,
            };
          })
        );
        setConversationInfo(fetchedConversations);
      } catch (error) {
        console.error("Error fetching interacted users info:", error);
      }
    };

    fetchInteractedUsersInfo();
  }, [auth.token, conversations.conversations, auth.userId]);

  console.log(conversationInfo);

  return (
    <>
      {conversationInfo.length !== 0 &&
        conversationInfo.map((conversation) => (
          <Box
            key={conversation.conversationId}
            sx={{
              transition: "background-color 0.3s ease",
              cursor: "pointer",
              padding: "10px 20px",
              display: "flex",
              borderRadius: "20px",
              alignItems: "center",
              margin: "10px 0",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.2)",
              },
            }}
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
                src={conversation.imagePreview}
                alt="personne"
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
                {conversation.fullName}
              </Box>
              <Box
                sx={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "white",
                  marginLeft: "25px",
                }}
              >
                {`${conversation.messagePreview}`}
              </Box>
            </div>
          </Box>
        ))}
      {conversationInfo.length === 0 && (
        <Typography
          sx={{
            marginTop: "20vh",
            alignItems: "center",
            display: "flex",
            textAlign: "center",
            fontSize: 25,
          }}
        >
          L'historique des conversations montre que vous n'avez aucune
          conversation
        </Typography>
      )}
    </>
  );
};

export default Conversations;
