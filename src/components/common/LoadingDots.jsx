import React from "react";
import { Box } from "@mui/material";

export default function LoadingDots() {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, height: 24 }}>
      <Box
        sx={{
          width: 10,
          height: 10,
          bgcolor: "#1976d2",
          borderRadius: "50%",
          animation: "dotFlashing 1s infinite linear alternate",
          animationDelay: "0s",
        }}
      />
      <Box
        sx={{
          width: 10,
          height: 10,
          bgcolor: "#388e3c",
          borderRadius: "50%",
          animation: "dotFlashing 1s infinite linear alternate",
          animationDelay: "0.2s",
        }}
      />
      <Box
        sx={{
          width: 10,
          height: 10,
          bgcolor: "#fbc02d",
          borderRadius: "50%",
          animation: "dotFlashing 1s infinite linear alternate",
          animationDelay: "0.4s",
        }}
      />
      <style>
        {`
          @keyframes dotFlashing {
            0% { opacity: 0.3; }
            50%, 100% { opacity: 1; }
          }
        `}
      </style>
    </Box>
  );
}
