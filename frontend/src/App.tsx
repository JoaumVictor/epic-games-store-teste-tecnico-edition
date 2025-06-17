import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import RedirectHome from "./pages/redirectHome";
import Checkout from "./pages/checkout";
import Payment from "./pages/payment";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RedirectHome />} />
        <Route path="/pt-br" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
    </Router>
  );
}

export default App;
