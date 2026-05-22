import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ThankYou from "./ThankYou.jsx";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from "./Admin.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/admin" element={<Admin />} />
        {/* Path-based sections so App Bridge highlights the right nav item */}
        <Route path="/admin/:tab" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
