/* Copyright (c) 2026 Jema Technology.
   Distributed under the license specified in the root directory of this project. */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Service worker registration is handled automatically by vite-plugin-pwa
// (injectRegister: "auto" in vite.config.js)

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
