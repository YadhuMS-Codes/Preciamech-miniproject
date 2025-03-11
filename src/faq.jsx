{/*import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import FAQPage from './FAQPage';
ReactDOM.createRoot(document.getElementById('root1')).render(
  <React.StrictMode>
    <BrowserRouter>
      <FAQPage />
    </BrowserRouter>
  </React.StrictMode>
);*/}
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import FAQPage from "./FAQPage"; // Import FAQ page

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/faq" element={<FAQPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);