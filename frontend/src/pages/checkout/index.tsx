/* eslint-disable react/style-prop-object */
import CheckoutHeader from "@/components/layout/headers/checkoutHeader";
import { useCart } from "@/context/cart";
import { formatterCurrency } from "@/utils/shared";
import Button from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Container from "@/components/ui/container";

export default function Checkout() {
  const { cart, dispatch, totalPriceInCart } = useCart();

  const handleDeleteGame = (id: string) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: id });
  };
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-[#1a1a1a] text-white">
      <CheckoutHeader />
      <Container className="px-4 pt-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="mb-2 text-2xl font-bold sm:text-3xl">Meu carrinho</p>
          <p className="text-lg text-gray-300">Total de itens: {cart.length}</p>
        </div>
        <div className="flex flex-col items-start justify-between w-full gap-8 lg:flex-row lg:gap-12">
          <div className="flex flex-col items-center w-full gap-4 my-4 lg:items-start lg:w-3/5 xl:w-2/3 lg:my-10">
            {cart.length === 0 && (
              <div className="flex flex-col items-center justify-center w-full gap-4 py-16 text-center sm:py-24 lg:py-32">
                <p className="text-xl text-white sm:text-2xl">
                  Seu carrinho está vazio
                </p>
                <img
                  src="https://wiki.hoyolab.com/_nuxt/img/page_empty.a56019d.png"
                  alt="carrinho vazio"
                  className="w-full max-w-[250px] sm:max-w-[350px] object-contain"
                />
              </div>
            )}
            {cart.map(({ game }) => (
              <div
                key={game._id}
                className="flex flex-col sm:flex-row items-center sm:items-start justify-between w-full p-4 gap-4 bg-[#232323] rounded-lg shadow-md"
              >
                <div
                  className="relative flex flex-col items-end justify-start w-full h-48 gap-2 p-4 overflow-hidden rounded-md sm:p-5 sm:w-3/4"
                  style={{
                    backgroundImage: `url(${game.cover})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  <h1 className="z-10 text-xl font-bold sm:text-2xl">
                    {game.name}
                  </h1>
                  <p className="z-10 text-base text-gray-200 sm:text-lg">
                    {typeof game.price === "number"
                      ? formatterCurrency(game.price)
                      : "Grátis"}
                  </p>
                </div>
                <div className="flex flex-row items-center justify-center w-full gap-4 mt-2 sm:flex-col sm:items-end sm:justify-between sm:w-auto sm:mt-0 sm:gap-6">
                  <p
                    className="text-sm text-blue-400 transition-colors cursor-pointer sm:text-base hover:underline"
                    onClick={() => navigate(`/game/${game._id}`)}
                  >
                    Detalhes
                  </p>
                  <p
                    onClick={() => handleDeleteGame(game._id)}
                    className="text-sm text-red-500 transition-colors cursor-pointer sm:text-base hover:underline"
                  >
                    Remover
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-end justify-start w-full lg:w-2/5 xl:w-1/3 gap-4 my-4 lg:my-10 p-6 bg-[#232323] rounded-lg shadow-md">
            <p className="mb-4 text-2xl font-bold text-right sm:text-3xl">
              Resumo de jogos e aplicativos
            </p>
            <div className="flex items-center justify-between w-full text-gray-300">
              <p>Desconto</p>
              <p>-R$ 0,00</p>
            </div>
            <div className="flex items-center justify-between w-full text-gray-300">
              <p>Impostos</p>
              <p className="text-gray-500">Calculado ao finalizar</p>
            </div>
            <div className="flex items-center justify-between w-full pt-4 mt-4 text-lg font-semibold border-t border-gray-600 sm:text-xl">
              <p>Preço: </p>
              <span>{formatterCurrency(totalPriceInCart)}</span>
            </div>
            <div className="flex items-center justify-between w-full mb-6 text-lg font-bold sm:text-xl">
              <p>Subtotal: </p>
              <span className="text-2xl sm:text-3xl">
                {formatterCurrency(totalPriceInCart)}
              </span>
            </div>
            <Button
              style="finally"
              disabled={cart.length === 0}
              onClick={() => navigate("/payment")}
              label="Finalizar pedido"
              className="w-full py-3 text-lg"
            />
          </div>
        </div>
      </Container>
    </main>
  );
}
