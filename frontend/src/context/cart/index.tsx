import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  Dispatch,
} from "react";

export interface GameProps {
  name: string;
  titleImage: string;
  status: string;
  price: number | "free";
  description: string;
  cover: string;
  banner: string;
}

export interface CartItem {
  game: GameProps;
}

type CartAction =
  | { type: "ADD_TO_CART"; payload: GameProps }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "SET_MOCKED_GAMES"; payload: GameProps[] };

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
    if (item.game.price === "free") {
      return acc;
    }
    return acc + item.game.price;
  }, 0);
};

const addToCart = (state: CartState, payload: GameProps): CartState => {
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

const setMockedGames = (state: CartState, payload: GameProps[]): CartState => ({
  ...state,
  cart: payload.map((game) => ({ game })),
});

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

    case "SET_MOCKED_GAMES":
      return setMockedGames(state, action.payload);

    default:
      return state;
  }
};
