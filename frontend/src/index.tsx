import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { CartProvider } from "./context/cart";
import { CreditCardProvider } from "./context/creditCard";
import { GamesProvider } from "./context/gamesContext";
import { UserProvider } from "./context/userContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <UserProvider>
      <GamesProvider>
        <CreditCardProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </CreditCardProvider>
      </GamesProvider>
    </UserProvider>
  </React.StrictMode>
);
