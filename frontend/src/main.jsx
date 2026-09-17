import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router-dom";
import App from "./App.jsx";
import { isStaticPreview } from "./services/api.js";
import { LanguageProvider } from "./context/LanguageContext.jsx";
import "./styles/global.css";
import "./styles/typography.css";

const Router = isStaticPreview ? HashRouter : BrowserRouter;

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </Router>
  </React.StrictMode>
);
