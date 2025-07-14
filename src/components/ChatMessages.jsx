import React from "react";
import { Box, Typography, Avatar, Paper, Link } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
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
              {/* Grouped text and files in one bubble */}
              {msg.text && (
                <Typography variant="body2" sx={{ mb: msg.files ? 1 : 0 }}>
                  {msg.text}
                </Typography>
              )}
              {msg.files && Array.isArray(msg.files) && msg.files.length > 0 && (
                <Box>
                  {msg.files.map((file, i) => (
                    <Paper
                      key={i}
                      sx={{
                        p: 1,
                        display: "flex",
                        alignItems: "center",
                        mt: i > 0 ? 1 : 0,
                      }}
                    >
                      {file.name && file.name.endsWith(".csv") ? (
                        <img
                          src="https://miro.medium.com/v2/resize:fit:866/1*RaXCbRLUuXGJ8jp36LhnMA.jpeg"
                          alt="csv icon"
                          style={{
                            width: 24,
                            height: 24,
                            marginRight: 8,
                            borderRadius: 4,
                          }}
                        />
                      ) : file.name && (file.name.endsWith(".jpg") || file.name.endsWith(".jpeg") || file.name.endsWith(".png")) ? (
                        <img
                          src={file.url || (file instanceof File ? URL.createObjectURL(file) : undefined)}
                          alt={file.name}
                          style={{
                            width: 24,
                            height: 24,
                            marginRight: 8,
                            borderRadius: 4,
                            objectFit: 'cover',
                          }}
                        />
                      ) : file.name && file.name.endsWith(".pdf") ? (
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg"
                          alt="pdf icon"
                          style={{
                            width: 24,
                            height: 24,
                            marginRight: 8,
                            borderRadius: 4,
                          }}
                        />
                      ) : (
                        <AttachFileIcon sx={{ mr: 1, color: "#1976d2" }} />
                      )}
                      <Link
                        href={
                          file.url ||
                          (file instanceof File
                            ? URL.createObjectURL(file)
                            : undefined)
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                        sx={{ fontWeight: 500 }}
                      >
                        {file.name}
                      </Link>
                    </Paper>
                  ))}
                </Box>
              )}
              {msg.type === "audio" && msg.audioUrl && (
                <audio controls src={msg.audioUrl} style={{ width: "100%" }} />
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
