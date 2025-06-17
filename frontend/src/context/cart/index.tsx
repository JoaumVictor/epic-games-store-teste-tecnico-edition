import { Game } from "@/types/games";
import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  Dispatch,
} from "react";

export interface CartItem {
  game: Game;
}

type CartAction =
  | { type: "ADD_TO_CART"; payload: Game }
  | { type: "REMOVE_FROM_CART"; payload: string };

type TotalPrice = (cart: CartItem[]) => number;

export interface CartState {
  cart: CartItem[];
}

const CartContext = createContext<
  | {
      state: CartState;
      dispatch: Dispatch<CartAction>;
      totalPriceInCart: TotalPrice;
    }
  | undefined
>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, { cart: [] });

  return (
    <CartContext.Provider value={{ state, dispatch, totalPriceInCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("Algo deu errado ao usar o contexto do carrinho");
  }

  return context;
};

const totalPriceInCart = (cart: CartItem[]): number => {
  return cart.reduce((acc, item) => {
    return acc + item.game.price;
  }, 0);
};

const addToCart = (state: CartState, payload: Game): CartState => {
  const existingCartItem = state.cart.find(
    (item) => item.game.name === payload.name
  );

  if (existingCartItem) {
    return {
      ...state,
      cart: state.cart.map((item) =>
        item.game.name === payload.name ? { ...item } : item
      ),
    };
  } else {
    return {
      ...state,
      cart: [...state.cart, { game: payload }],
    };
  }
};

const removeFromCart = (state: CartState, payload: string): CartState => ({
  ...state,
  cart: state.cart.filter((item) => item.game.name !== payload),
});

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_TO_CART":
      return addToCart(state, action.payload);

    case "REMOVE_FROM_CART":
      return removeFromCart(state, action.payload);

    default:
      return state;
  }
};
