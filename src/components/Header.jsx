import React from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <nav>
      <NavLink to="/" style={{ marginRight: "10px" }}>
        Home
      </NavLink>
      <NavLink to="/signup" style={{ marginRight: "10px" }}>
        Signup
      </NavLink>
      <NavLink to="/login">Login</NavLink>
    </nav>
  );
};

export default Header;
