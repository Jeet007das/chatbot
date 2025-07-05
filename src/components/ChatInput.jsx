import React, { useState, useRef } from "react";
import { Box, TextField, IconButton, Tooltip } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MicIcon from "@mui/icons-material/Mic";
import ChatbotConfig from "../config/chatbotConfig";

export default function ChatInput({
  onSend,
  onAttach,
  onAudio,
  disabled,
  attachments,
}) {
  const [input, setInput] = useState("");
  const fileInputRef = useRef(null);

  // Audio recording state
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  // File attach handler
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    // Only allow xls/csv and max 2 files
    const validFiles = files
      .filter(
        (file) =>
          file.type === "application/vnd.ms-excel" ||
          file.type === "text/csv" ||
          file.name.endsWith(".xls") ||
          file.name.endsWith(".csv")
      )
      .slice(0, 2 - attachments.length);
    if (validFiles.length) {
      onAttach(validFiles);
    }
    e.target.value = "";
  };

  // Audio record handlers
  const handleMicClick = async () => {
    if (recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    } else {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        mediaRecorderRef.current = new window.MediaRecorder(stream);
        audioChunks.current = [];
        mediaRecorderRef.current.ondataavailable = (e) => {
          audioChunks.current.push(e.data);
        };
        mediaRecorderRef.current.onstop = async () => {
          const audioBlob = new Blob(audioChunks.current, {
            type: "audio/wav",
          });
          // Convert audio to text (mock, replace with real API)
          onAudio(audioBlob);
        };
        mediaRecorderRef.current.start();
        setRecording(true);
      }
    }
  };

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input);
      setInput("");
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      {ChatbotConfig.enableAttachment && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xls"
            multiple
            style={{ display: "none" }}
            onChange={handleFileChange}
            disabled={attachments.length >= 2}
          />
          <Tooltip title="Attach file">
            <span>
              <IconButton
                onClick={() => fileInputRef.current.click()}
                disabled={attachments.length >= 2 || disabled}
              >
                <AttachFileIcon />
              </IconButton>
            </span>
          </Tooltip>
        </>
      )}
      <TextField
        fullWidth
        size="small"
        variant="outlined"
        placeholder={recording ? "Listening..." : "Type a message..."}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        disabled={disabled || recording}
      />
      {ChatbotConfig.enableAudio && (
        <Tooltip title={recording ? "Stop recording" : "Record audio"}>
          <span>
            <IconButton
              color={recording ? "error" : "primary"}
              onClick={handleMicClick}
              disabled={disabled}
            >
              <MicIcon />
            </IconButton>
          </span>
        </Tooltip>
      )}
      <IconButton
        color="primary"
        onClick={handleSend}
        disabled={disabled || recording}
      >
        <SendIcon />
      </IconButton>
    </Box>
  );
}
