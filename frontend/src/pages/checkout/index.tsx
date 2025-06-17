/* eslint-disable react/style-prop-object */
import CheckoutHeader from "@/components/checkoutHeader";
import LimitScreen from "@/components/limitScreen";
import { useCart } from "@/context/cart";
import games from "@/mocks/games";
import { useEffect } from "react";
import { formatterCurrency } from "@/utils/shared";
import Button from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { state, dispatch, totalPriceInCart } = useCart();

  const handleDeleteGame = (gameName: string) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: gameName });
  };
  const navigate = useNavigate();

  return (
    <main>
      <CheckoutHeader />
      <LimitScreen>
        <div>
          <p className="text-3xl">Meu carrinho</p>
          <p>Total de itens: {state.cart.length}</p>
        </div>
        <div className="flex items-start justify-between w-full">
          <div className="flex flex-col items-start justify-center w-1/2 gap-3 my-10">
            {state.cart.length === 0 && (
              <div className="flex flex-col items-center justify-center w-full gap-4 my-64">
                <p className="text-xl text-white">Seu carrinho está vazio</p>
                <img
                  src="https://wiki.hoyolab.com/_nuxt/img/page_empty.a56019d.png"
                  alt="carrinho vazio"
                  className="w-[350px]"
                />
              </div>
            )}
            {state.cart.map(({ game }) => (
              <div className="flex items-center justify-end w-full gap-5">
                <div
                  className="flex items-start justify-end flex-col gap-3 h-[200px] bg-[#232323] w-full checkoutGameBanner rounded-[8px]"
                  style={{
                    backgroundImage: `url(${game.cover})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "100% 20%",
                  }}
                >
                  <h1 className="z-10 text-[22px]">{game.name}</h1>
                  <p className="z-10">
                    {typeof game.price === "number"
                      ? formatterCurrency(game.price)
                      : "Grátis"}
                  </p>
                </div>
                <div>
                  <p className="my-5 cursor-pointer">Detalhes</p>
                  <p
                    onClick={() => handleDeleteGame(game.name)}
                    className="my-5 text-red-500 cursor-pointer"
                  >
                    Remover
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-end justify-start w-1/4 gap-2">
            <p className="mb-10 text-4xl text-end">
              Resumo de jogos e aplicativos
            </p>
            <div className="flex items-center justify-between w-full">
              <p>Desconto</p>
              <p>-R$ 0,00</p>
            </div>
            <div className="flex items-center justify-between w-full">
              <p>Impostos</p>
              <p className="text-gray-500">Calculado ao finalizar</p>
            </div>
            <div className="flex items-center justify-between w-full">
              <p className="text-white">Preço: </p>
              <span className="text-white">
                {formatterCurrency(totalPriceInCart(state.cart))}
              </span>
            </div>
            <div className="flex items-center justify-between w-full">
              <p className="my-6">Subtotal: </p>
              <span className="text-[22px] text-white">
                {formatterCurrency(totalPriceInCart(state.cart))}
              </span>
            </div>
            <div>
              <Button
                style="finally"
                disabled={state.cart.length === 0}
                onClick={() => navigate("/payment")}
                label="Finalizar pedido"
              />
            </div>
          </div>
        </div>
      </LimitScreen>
    </main>
  );
}
