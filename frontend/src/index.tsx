import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { CartProvider } from "./context/cart";
import { CreditCardProvider } from "./context/creditCard";
import { GamesProvider } from "./context/gamesContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <GamesProvider>
      <CreditCardProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </CreditCardProvider>
    </GamesProvider>
  </React.StrictMode>
);
