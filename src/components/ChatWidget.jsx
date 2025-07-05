import React, { useState } from "react";
import { Box, Paper, IconButton, Avatar, Typography } from "@mui/material";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import ChatbotConfig from "../config/chatbotConfig";
import ChatIcon from "@mui/icons-material/Chat";
import LoadingDots from "./common/LoadingDots";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! How can I help you?" },
  ]);
  const [loading, setLoading] = useState(false);
  const [attachments, setAttachments] = useState([]);

  const handleSend = (text) => {
    setMessages((prev) => [...prev, { from: "user", text }]);
    setLoading(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "This is a mock reply." },
      ]);
      setLoading(false);
    }, 5000);
    setAttachments([]); // clear attachments after send
  };

  const handleAttach = (files) => {
    files.forEach((file) => {
      setMessages((prev) => [...prev, { from: "user", type: "file", file }]);
    });
    setAttachments((prev) => [...prev, ...files].slice(0, 2));
  };

  const handleAudio = (audioBlob) => {
    const audioUrl = URL.createObjectURL(audioBlob);
    setMessages((prev) => [...prev, { from: "user", type: "audio", audioUrl }]);
    setLoading(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "This is a mock reply for your audio." },
      ]);
      setLoading(false);
    }, 5000);
  };

  if (!open) {
    return (
      <IconButton
        onClick={() => setOpen(true)}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          background: ChatbotConfig.headerBg,
          color: "#fff",
          width: 64,
          height: 64,
          boxShadow: 3,
          "&:hover": { background: "#1565c0" },
        }}
        size="large"
      >
        <ChatIcon sx={{ fontSize: 26 }} />
      </IconButton>
    );
  }

  return (
    <Paper
      elevation={6}
      sx={{
        width: 340,
        height: 480,
        position: "fixed",
        bottom: 24,
        right: 24,
        display: "flex",
        flexDirection: "column",
        zIndex: 9999,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          paddingTop: 1,
          paddingBottom: 1,
          paddingLeft: 2,
          paddingRight: 2,
          background: ChatbotConfig.headerBg,
          color: ChatbotConfig.headerText,
        }}
      >
        <Avatar src={ChatbotConfig.botAvatar} sx={{ mr: 1 }} />
        <Typography variant="h6" sx={{ flex: 1 }}>
          {ChatbotConfig.botName}
        </Typography>
        <IconButton onClick={() => setOpen(false)} sx={{ color: "#fff" }}>
          ×
        </IconButton>
      </Box>
      {/* Messages */}
      <Box sx={{ flex: 1, overflowY: "auto", p: 2, background: "#fafafa" }}>
        <ChatMessages messages={messages} />
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 1 }}>
            <LoadingDots />
          </Box>
        )}
      </Box>
      {/* Input */}
      <Box sx={{ p: 1, borderTop: "1px solid #eee" }}>
        <ChatInput
          onSend={handleSend}
          onAttach={handleAttach}
          onAudio={handleAudio}
          disabled={loading}
          attachments={attachments}
        />
      </Box>
    </Paper>
  );
}
