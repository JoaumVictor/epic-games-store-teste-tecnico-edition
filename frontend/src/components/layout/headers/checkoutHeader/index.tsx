import { AiOutlineUser } from "react-icons/ai";

import "./style.scss";

function CheckoutHeader() {
  return (
    <header className="px-10 mb-8">
      <a href="/" className="tagsBox">
        <div className="logoLink">
          <img
            src="https://logodownload.org/wp-content/uploads/2020/10/epic-games-logo.png"
            alt="epicLogo"
            className="logo"
          />
        </div>
      </a>
      <div className="userBox">
        <a href="/profile">
          <AiOutlineUser className="icon" />
        </a>
        <div className="download">
          <p>Baixar Epic Games </p>
        </div>
      </div>
    </header>
  );
}

export default CheckoutHeader;
