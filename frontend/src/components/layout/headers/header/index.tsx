import "./style.scss";
import { AiOutlineGlobal, AiOutlineUser } from "react-icons/ai";
import { PiShoppingCartSimpleFill } from "react-icons/pi";
import { useState } from "react";
import tags from "@/mocks/tags";
import { useCart } from "@/context/cart";
import Cart from "@/components/pages/home/cart";

function Header() {
  const [openCart, setOpenCart] = useState(false);
  const { cart } = useCart();

  return (
    <header className="px-10 mb-8">
      <div className="tagsBox">
        <a href="/" className="logoLink">
          <img
            src="https://logodownload.org/wp-content/uploads/2020/10/epic-games-logo.png"
            alt="epicLogo"
            className="logo"
          />
        </a>
        {tags.map((tag) => (
          <p
            key={tag}
            className="text-gray-500 transition-all tag hover:text-white"
          >
            {tag.toUpperCase()}
          </p>
        ))}
      </div>
      <div className="userBox">
        <p className="mr-1">{cart.length}</p>
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
