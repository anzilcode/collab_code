import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./Context/AuthContext"; 
import { ResumeProvider } from "./Context/ResumeContext";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ResumeProvider> 
          <App />
        </ResumeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);



