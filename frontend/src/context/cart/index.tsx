import { Game } from "@/api/dto/games";
import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  Dispatch,
  useMemo,
  useEffect,
} from "react";

export interface CartItem {
  game: Game;
}

type CartAction =
  | { type: "ADD_TO_CART"; payload: Game }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "CLEAR_CART" };

type CartState = CartItem[];

interface CartContextValue {
  cart: CartState;
  dispatch: Dispatch<CartAction>;
  totalPriceInCart: number;
  totalPriceWithDiscount: number;
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

    case "CLEAR_CART":
      return [];

    default:
      return state;
  }
};

const initializeCart = (): CartState => {
  try {
    const storedCart = localStorage.getItem("epicGamesCart");
    return storedCart ? JSON.parse(storedCart) : [];
  } catch (error) {
    console.error("Failed to parse cart from localStorage:", error);
    return [];
  }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cart, dispatch] = useReducer(cartReducer, [], initializeCart);

  useEffect(() => {
    try {
      localStorage.setItem("epicGamesCart", JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [cart]);

  const totalPrice = useMemo(() => {
    return cart.reduce((acc, item) => {
      const price = item.game.price || 0;
      return acc + price;
    }, 0);
  }, [cart]);

  const totalPriceWithDiscount = useMemo(() => {
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
      totalPriceWithDiscount: totalPriceWithDiscount,
    }),
    [cart, dispatch, totalPrice, totalPriceWithDiscount]
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
