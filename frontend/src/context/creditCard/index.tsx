import React, { createContext, useContext, ReactNode } from "react";
import { creditCardsProps } from "@/components/creditCardDropdown";

interface CreditCardContextProps {
  creditCards: creditCardsProps[];
  addCreditCard: (newCard: creditCardsProps) => void;
  removeCreditCard: (cardId: string) => void;
}

const CreditCardContext = createContext<CreditCardContextProps | undefined>(
  undefined
);

export const CreditCardProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [creditCards, setCreditCards] = React.useState<creditCardsProps[]>([
    {
      id: "123",
      label: "Mastercard",
      number: "**** **** **** 1234",
      name: "John Doe",
      expiration: "12/25",
      cvv: "123",
    },
    {
      id: "456",
      label: "Visa",
      number: "**** **** **** 5678",
      name: "John Doe",
      expiration: "12/25",
      cvv: "123",
    },
    {
      id: "789",
      label: "Elo",
      number: "**** **** **** 9101",
      name: "John Doe",
      expiration: "12/25",
      cvv: "123",
    },
  ]);

  // aguardando um backend pra fazer a requisição
  const addCreditCard = (newCard: creditCardsProps) => {
    setCreditCards((prevCards) => [...prevCards, newCard]);
  };

  // aguardando um backend pra fazer a requisição
  const removeCreditCard = (cardId: string) => {
    setCreditCards((prevCards) =>
      prevCards.filter((card) => card.id !== cardId)
    );
  };

  return (
    <CreditCardContext.Provider
      value={{ creditCards, addCreditCard, removeCreditCard }}
    >
      {children}
    </CreditCardContext.Provider>
  );
};

export const useCreditCard = () => {
  const context = useContext(CreditCardContext);
  if (!context) {
    throw new Error(
      "useCreditCardContext deve ser usado com um CreditCardProvider"
    );
  }
  return context;
};
