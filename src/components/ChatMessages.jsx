import React from "react";
import { Box, Typography, Avatar, Paper } from "@mui/material";
import ChatbotConfig from "../config/chatbotConfig";

export default function ChatMessages({ messages }) {
  return (
    <Box>
      {messages.map((msg, idx) => {
        const isUser = msg.from === "user";
        return (
          <Box
            key={idx}
            sx={{
              display: "flex",
              justifyContent: isUser ? "flex-end" : "flex-start",
              mb: 1,
            }}
          >
            {!isUser && (
              <Avatar
                src={ChatbotConfig.botAvatar}
                sx={{ width: 28, height: 28, mr: 1, alignSelf: "flex-end" }}
              />
            )}
            <Box
              sx={{
                bgcolor: isUser
                  ? ChatbotConfig.userBubbleColor
                  : ChatbotConfig.botBubbleColor,
                color: isUser
                  ? ChatbotConfig.userTextColor
                  : ChatbotConfig.botTextColor,
                px: 2,
                py: 1,
                borderRadius: 2,
                maxWidth: "70%",
                wordBreak: "break-word",
              }}
            >
              {msg.type === "file" ? (
                <Paper sx={{ p: 1, display: "flex", alignItems: "center" }}>
                  <Avatar sx={{ bgcolor: "#eee", mr: 1, color: "#1976d2" }}>
                    {msg.file.name.endsWith(".csv") ? "CSV" : "XLS"}
                  </Avatar>
                  <Typography variant="body2">{msg.file.name}</Typography>
                </Paper>
              ) : msg.type === "audio" ? (
                <audio controls src={msg.audioUrl} style={{ width: "100%" }} />
              ) : (
                <Typography variant="body2">{msg.text}</Typography>
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
