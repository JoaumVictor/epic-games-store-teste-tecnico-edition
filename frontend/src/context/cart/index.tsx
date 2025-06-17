import { Game } from "@/types/games";
import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  Dispatch,
  useMemo,
} from "react";

export interface CartItem {
  game: Game;
}

type CartAction =
  | { type: "ADD_TO_CART"; payload: Game }
  | { type: "REMOVE_FROM_CART"; payload: string };

type CartState = CartItem[];

interface CartContextValue {
  cart: CartState;
  dispatch: Dispatch<CartAction>;
  totalPriceInCart: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_TO_CART":
      const existingCartItem = state.find(
        (item) => item.game._id === action.payload._id
      );

      if (existingCartItem) {
        return state;
      } else {
        return [...state, { game: action.payload }];
      }

    case "REMOVE_FROM_CART":
      return state.filter((item) => item.game._id !== action.payload);

    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cart, dispatch] = useReducer(cartReducer, []);

  const totalPrice = useMemo(() => {
    return cart.reduce((acc, item) => {
      const price = item.game.price || 0;
      const discount = item.game.discount || 0;
      return acc + price * (1 - discount / 100);
    }, 0);
  }, [cart]);

  const contextValue = useMemo(
    () => ({
      cart,
      dispatch,
      totalPriceInCart: totalPrice,
    }),
    [cart, dispatch, totalPrice]
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("Algo deu errado ao usar o contexto do carrinho");
  }

  return context;
};
