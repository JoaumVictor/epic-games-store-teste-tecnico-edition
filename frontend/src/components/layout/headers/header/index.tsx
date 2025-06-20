import "./style.scss";
import { AiOutlineGlobal, AiOutlineUser } from "react-icons/ai";
import { PiShoppingCartSimpleFill } from "react-icons/pi";
import { useState } from "react";
import { useCart } from "@/context/cart";
import Cart from "@/components/pages/home/cart";

function Header() {
  const [openCart, setOpenCart] = useState(false);
  const { cart } = useCart();

  const tags = ["Store", "Perguntas Frequentes", "Ajuda", "Unreal Engine"];

  return (
    <header className="px-4 sm:px-10 mb-8 flex items-center justify-between h-16 bg-[#1a1a1a] text-white shadow-md">
      <div className="flex items-center gap-4 sm:gap-6">
        <a href="/" className="flex-shrink-0">
          <img
            src="https://logodownload.org/wp-content/uploads/2020/10/epic-games-logo.png"
            alt="epicLogo"
            className="w-auto h-8 sm:h-10"
          />
        </a>
        <div className="items-center hidden gap-4 md:flex lg:gap-6">
          {tags.map((tag) => (
            <p
              key={tag}
              className="text-sm text-gray-400 transition-all cursor-pointer lg:text-base hover:text-white"
            >
              {tag.toUpperCase()}
            </p>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <p className="mr-1 text-sm text-gray-300 sm:text-base">{cart.length}</p>
        <PiShoppingCartSimpleFill
          onClick={() => setOpenCart(true)}
          className="text-xl transition-colors cursor-pointer sm:text-2xl hover:text-gray-300"
        />
        <AiOutlineGlobal className="hidden text-xl transition-colors cursor-pointer sm:text-2xl hover:text-gray-300 sm:block" />
        <a href="/profile" className="flex items-center">
          <AiOutlineUser className="text-xl transition-colors cursor-pointer sm:text-2xl hover:text-gray-300" />
        </a>
        <div className="hidden sm:flex items-center justify-center bg-[#0078f2] hover:bg-[#005bb5] transition-colors rounded-md px-3 py-1.5 text-sm font-medium ml-4 cursor-pointer">
          <p>Baixar Epic Games</p>
        </div>
      </div>
      {openCart && <Cart setOpenCart={setOpenCart} />}
    </header>
  );
}

export default Header;
