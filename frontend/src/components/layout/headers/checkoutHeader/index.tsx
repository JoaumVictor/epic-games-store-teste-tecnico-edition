import { AiOutlineUser } from "react-icons/ai";

import "./style.scss";

function CheckoutHeader() {
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
      </div>
      <div className="userBox">
        <AiOutlineUser className="icon" />
        <div className="download">
          <p>Baixar Epic Games </p>
        </div>
      </div>
    </header>
  );
}

export default CheckoutHeader;
