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
        className="fixed right-0 top-0 bg-[#242424] w-[400px] h-[100vh] flex items-center justify-between flex-col p-10 z-50"
      >
        <div className="w-full">
          <div className="flex items-center justify-between w-full">
            <div />
            <p className="w-full text-3xl text-center text-white">Carrinho</p>
            <div onClick={handleClose} className="cursor-pointer">
              <IoCloseOutline className="text-2xl text-white" />
            </div>
          </div>
          <div
            className={classNames(
              "flex flex-col items-center h-full gap-4",
              cart.length === 0 ? "justify-center" : "justify-start pt-8"
            )}
          >
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 mt-24">
                <p className="text-white">Seu carrinho está vazio</p>
                <img
                  src="https://wiki.hoyolab.com/_nuxt/img/page_empty.a56019d.png"
                  alt="varrinho vazio"
                  className="min-w-[170px] max-w-[200px]"
                />
              </div>
            ) : (
              cart.map((item) => (
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
                    onClick={() => handleDeleteGame(item.game._id)}
                    className="ml-8 text-[20px] transition-all cursor-pointer !text-white"
                  />
                </div>
              ))
            )}
          </div>
        </div>
        <div className="flex flex-col items-start justify-center gap-6">
          <p className="">
            Total:{" "}
            <span className="text-[22px]">
              {formatterCurrency(totalPriceInCart)}
            </span>
          </p>
          <div className="flex items-center w-full gap-6 justify-evenly">
            <Link to="/checkout">
              <Button
                disabled={cart.length === 0}
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
