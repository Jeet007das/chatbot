import React, { useState, useRef } from "react";
import { Box, TextField, IconButton, Tooltip } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MicIcon from "@mui/icons-material/Mic";
import ChatbotConfig from "../config/chatbotConfig";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
 
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
 
  // Speech-to-text handlers using Web Speech API
  const recognitionRef = useRef(null);
 
  // File attach handler
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    // Only allow xls/csv/pdf/jpg/jpeg/png
    const validFiles = files.filter(
      (file) =>
        file.type === "application/vnd.ms-excel" ||
        file.type === "application/pdf" ||
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "text/csv" ||
        file.name.endsWith(".xls") ||
        file.name.endsWith(".csv") ||
        file.name.endsWith(".pdf") ||
        file.name.endsWith(".jpg") ||
        file.name.endsWith(".jpeg") ||
        file.name.endsWith(".png")
    );
    // Combine with existing attachments, but max 2
    const combined = [...attachments, ...validFiles].slice(0, 2);
    if (combined.length > 0) {
      onAttach(combined);
    }
    e.target.value = "";
  };
 
  // Audio record handlers
  const handleMicClick = () => {
    if (recording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setRecording(false);
    } else {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Speech Recognition is not supported in this browser.");
        return;
      }
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };
      recognition.onerror = (event) => {
        alert("Speech recognition error: " + event.error);
      };
      recognition.onend = () => {
        setRecording(false);
      };
      recognitionRef.current = recognition;
      recognition.start();
      setRecording(true);
    }
  };
 
  const handleSend = () => {
    if ((input.trim() || attachments.length > 0) && !disabled) {
      onSend({
        text: input.trim() || undefined,
        files:
          attachments.length > 0 ? attachments : undefined,
      });
      setInput("");
      if (attachments.length > 0) {
        setAttachments([]);
      }
    }
  };
 
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      {ChatbotConfig.enableAttachment && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xls,.pdf,.jpg,.jpeg,.png"
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
      {/* Input and file preview column */}
      <Box sx={{ display: "flex", flexDirection: "column", flex: 1, mr: 1 }}>
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          placeholder={recording ? "Listening..." : "Type a message..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={disabled || recording}
          sx={{ mb: attachments.length > 0 ? 1 : 0 }}
        />
        {/* Show attached files before sending */}
        {attachments.length > 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", maxWidth: 240 }}>
            {attachments.map((file, idx) => {
              let icon = <AttachFileIcon fontSize="small" sx={{ mr: 0.5 }} />;
              if (file.name.toLowerCase().endsWith('.csv')) {
                icon = <InsertDriveFileIcon sx={{ color: '#1976d2', mr: 1 }} />;
              } else if (file.name.toLowerCase().endsWith('.pdf')) {
                icon = <PictureAsPdfIcon sx={{ color: 'red', mr: 1 }} />;
              } else if (
                file.name.toLowerCase().endsWith('.jpg') ||
                file.name.toLowerCase().endsWith('.jpeg') ||
                file.name.toLowerCase().endsWith('.png')
              ) {
                icon = <ImageIcon sx={{ color: '#388e3c', mr: 1 }} />;
              }
              return (
                <Box key={idx} sx={{ display: "flex", alignItems: "center", mb: 0.5, bgcolor: '#f5f5f5', borderRadius: 1, px: 1, py: 0.5 }}>
                  {icon}
                  <span style={{ fontSize: 13, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
                  <IconButton size="small" sx={{ ml: 0.5 }} onClick={() => {
                    // Remove the file at idx from attachments and update parent state
                    const newFiles = attachments.filter((_, i) => i !== idx);
                    onAttach(newFiles);
                  }}>
                    ×
                  </IconButton>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
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
 
 
 