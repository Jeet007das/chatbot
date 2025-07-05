import React from "react";
import ReactDOM from "react-dom/client";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import ReactApp from "./ReactApp.jsx";
// import r2wc from "@r2wc/react-to-web-component";

// const ReactAppElement = r2wc(ReactApp);
// customElements.define("react-app", ReactAppElement);

//import reactToWebComponent from "@r2wc/react-to-web-component";
import r2wc from "@r2wc/react-to-web-component";
import ChatBotWidget from "./ChatBot";
import chatbotConfig from "./config/chatbotConfig";

const ChatBot = r2wc(ChatBotWidget, {
  props: chatbotConfig,
});

// const WebComponent = reactToWebComponent(ReactApp, React, ReactDOM);

// ❗ Register the custom element
customElements.define("chatbot-widget", ChatBot);

if (document.getElementById("root")) {
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <ChatBotWidget />
    </StrictMode>
  );
}
