import { AiOutlineGlobal, AiOutlineUser } from "react-icons/ai";
import { PiShoppingCartSimpleFill } from "react-icons/pi";
import { useState } from "react";

import tags from "@/mocks/tags";
import "./style.scss";
import Cart from "@/components/cart";
import { useCart } from "@/context/cart";
import { Link } from "react-router-dom";

function Header() {
  const [openCart, setOpenCart] = useState(false);
  const { state } = useCart();

  return (
    <header className="px-10 mb-8">
      <div className="tagsBox">
        <Link to="/" className="logoLink">
          <img
            src="https://logodownload.org/wp-content/uploads/2020/10/epic-games-logo.png"
            alt="epicLogo"
            className="logo"
          />
        </Link>
        {tags.map((tag) => (
          <p className="text-gray-500 transition-all tag hover:text-white">
            {tag.toUpperCase()}
          </p>
        ))}
      </div>
      <div className="userBox">
        <p className="mr-1">{state.cart.length}</p>
        <PiShoppingCartSimpleFill
          onClick={() => setOpenCart(true)}
          className="icon"
        />
        <AiOutlineGlobal className="icon" />
        <AiOutlineUser className="icon" />
        <div className="download">
          <p>Baixar Epic Games </p>
        </div>
      </div>
      {openCart && <Cart setOpenCart={setOpenCart} />}
    </header>
  );
}

export default Header;
