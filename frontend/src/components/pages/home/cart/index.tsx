import { useCart } from "@/context/cart";

import { FaTrash } from "react-icons/fa";
import { formatterCurrency } from "@/utils/shared";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Button from "@/components/ui/button";

interface CartProps {
  setOpenCart: (value: boolean) => void;
}

export default function Cart({ setOpenCart }: CartProps) {
  const { state, dispatch, totalPriceInCart } = useCart();
  const cutLongNameIfNecessary = (name: string) => {
    if (name.length > 16) {
      return `${name.slice(0, 16)}...`;
    }
    return name;
  };

  const handleDeleteGame = (gameName: string) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: gameName });
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
        className="fixed right-0 top-0 bg-[#242424] h-[100vh] w-[18%] flex items-center justify-between flex-col pb-4"
      >
        <div className="my-6">
          <p className="w-full mb-6 text-3xl text-center text-white">
            Carrinho
          </p>
          <div className="flex flex-col items-center justify-start gap-4">
            {state.cart.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-4 my-64">
                <p className="text-white">Seu carrinho está vazio</p>
                <img
                  src="https://wiki.hoyolab.com/_nuxt/img/page_empty.a56019d.png"
                  alt="varrinho vazio"
                  className="w-[200px]"
                />
              </div>
            )}
            {state.cart.map((item) => (
              <div className="flex items-center justify-between w-full gap-4">
                <img
                  src={item.game.banner}
                  alt={item.game.name}
                  className="w-[76px] rounded-[8px]"
                />
                <div className="flex flex-col items-start justify-start w-1/2">
                  <p className="text-white text-[18px]">
                    {cutLongNameIfNecessary(item.game.name)}
                  </p>
                  <p>{formatterCurrency(item.game.price)}</p>
                </div>
                <FaTrash
                  onClick={() => handleDeleteGame(item.game.name)}
                  className="ml-8 text-[20px] transition-all cursor-pointer !text-white"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-start justify-center">
          <p className="my-6">
            Total:{" "}
            <span className="text-[22px]">
              {formatterCurrency(totalPriceInCart(state.cart))}
            </span>
          </p>
          <div className="flex items-center w-full gap-7 justify-evenly">
            <Link to="/checkout">
              <Button
                disabled={state.cart.length === 0}
                label="Finalizar pedido"
                onClick={handleClose}
              />
            </Link>
            <Button label="Fechar" onClick={handleClose} />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
