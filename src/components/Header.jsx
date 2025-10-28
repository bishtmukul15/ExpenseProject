import React from "react";

import Home from "../pages/Home";
import Products from "../pages/Products";
import AboutUs from "../pages/AboutUs";
const Header = () => {
  return (
    <div>
      <div>
        <Home />
      </div>
      <div>
        <Products />
      </div>
      <div>
        <AboutUs />
      </div>
    </div>
  );
};

export default Header;
