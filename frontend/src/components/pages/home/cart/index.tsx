import { useCart } from "@/context/cart";
import { FaTrash } from "react-icons/fa";
import { classNames, formatterCurrency } from "@/utils/shared";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Button from "@/components/ui/button";
import { IoCloseOutline } from "react-icons/io5";

interface CartProps {
  setOpenCart: (value: boolean) => void;
}

export default function Cart({ setOpenCart }: CartProps) {
  const { cart, dispatch, totalPriceInCart } = useCart();

  const cutLongNameIfNecessary = (name: string) => {
    if (name.length > 16) {
      return `${name.slice(0, 16)}...`;
    }
    return name;
  };

  const handleDeleteGame = (gameId: string) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: gameId });
  };

  const cartVariants = {
    hidden: { x: "100%" },
    exit: { x: "100%" },
    visible: { x: 0 },
  };

  const handleClose = () => {
    setTimeout(() => setOpenCart(false), 300);
  };

  return (
    <AnimatePresence>
      <motion.div
        variants={cartVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed right-0 top-0 bg-[#242424] w-full sm:w-[370px] md:w-[450px] h-[100vh] flex items-center justify-between flex-col p-4 sm:p-6 md:p-10 z-50 shadow-lg"
      >
        <div className="flex flex-col flex-grow w-full">
          <div className="flex items-center justify-between w-full pb-6">
            <div className="w-[28px]" />
            <p className="flex-grow text-2xl font-bold text-center text-white sm:text-3xl">
              Carrinho
            </p>
            <IoCloseOutline
              onClick={handleClose}
              className="text-3xl text-white transition-colors cursor-pointer hover:text-gray-300"
            />
          </div>
          <div
            className={classNames(
              "flex flex-col items-center flex-grow overflow-y-auto px-1",
              cart.length === 0
                ? "justify-center"
                : "justify-start pt-4 sm:pt-8"
            )}
          >
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 mt-12 sm:mt-24">
                <p className="text-lg text-white sm:text-xl">
                  Seu carrinho está vazio
                </p>
                <img
                  src="https://wiki.hoyolab.com/_nuxt/img/page_empty.a56019d.png"
                  alt="carrinho vazio"
                  className="w-full max-w-[170px] sm:max-w-[200px] object-contain"
                />
              </div>
            ) : (
              <div className="w-full">
                {cart.map((item) => (
                  <div
                    key={`${item.game._id}-in-cart`}
                    className="flex items-center justify-between w-full gap-3 sm:gap-4 p-2 mb-2 rounded-md hover:bg-[#2e2e2e] transition-colors"
                  >
                    <img
                      src={item.game.banner}
                      alt={item.game.name}
                      className="w-[76px] h-[76px] object-contain rounded-md flex-shrink-0"
                    />
                    <div className="flex flex-col items-start justify-center flex-grow overflow-hidden">
                      <p className="overflow-hidden text-sm text-white whitespace-nowrap text-ellipsis">
                        {cutLongNameIfNecessary(item.game.name)}
                      </p>
                      <p className="text-xs text-gray-300">
                        {formatterCurrency(item.game.price)}
                      </p>
                    </div>
                    <FaTrash
                      onClick={() => handleDeleteGame(item.game._id)}
                      className="flex-shrink-0 ml-2 text-lg text-white transition-colors cursor-pointer sm:text-xl hover:text-red-500"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-start justify-end w-full pb-4 pt-6 bg-[#242424] border-t border-gray-700">
          <p className="mb-4 text-lg text-white sm:text-lg">
            Total:{" "}
            <span className="text-2xl font-bold text-white sm:text-2xl">
              {formatterCurrency(totalPriceInCart)}
            </span>
          </p>
          <div className="flex flex-col items-center w-full gap-4 sm:flex-row sm:gap-6">
            <Link to="/checkout" className="w-full">
              <Button
                disabled={cart.length === 0}
                label="Finalizar pedido"
                onClick={handleClose}
                className="w-full !text-sm"
                style="finally"
              />
            </Link>
            <Button
              label="Fechar"
              onClick={handleClose}
              className="w-full bg-gray-600 hover:bg-gray-700 !text-sm"
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
