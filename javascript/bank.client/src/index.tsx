import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./Router";
import { BrowserRouter } from "react-router-dom";
import BankButton from "./components/BankButton";
import { ING } from "./banks/ING";
import { Argenta } from "./banks/Argenta";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <div
    style={{
      backgroundColor: "lightgrey",
      maxWidth: "100% !important",
      height: "100%",
      minHeight: "100vh",
      display: "grid",
      gridTemplateColumns: "1fr auto 1fr",
    }}
  >
    <BrowserRouter>
      <div
        style={{ marginTop: "25px", display: "flex", justifyContent: "center" }}
      >
        <BankButton bank={ING} />
      </div>
      <div style={{ flexGrow: 1 }}>
        <App />
      </div>
      <div
        style={{ marginTop: "25px", display: "flex", justifyContent: "center" }}
      >
        <BankButton bank={Argenta} />
      </div>
    </BrowserRouter>
  </div>
);
