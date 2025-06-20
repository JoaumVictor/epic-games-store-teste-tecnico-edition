import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import RedirectHome from "./pages/redirectHome";
import Checkout from "./pages/checkout";
import Payment from "./pages/payment";
import Profile from "./pages/profile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/*" element={<RedirectHome />} />
      </Routes>
    </Router>
  );
}

export default App;
