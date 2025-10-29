import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Signup from "./Auth/Signup";
import Login from "./Auth/Login";
import Profile from "./components/Profile";

const App = () => {
  return (
    <div>
      <Router>
        <Header />
        <Routes>
          <Route path="/signup" element={<Signup />} />

          {/* Login Page */}
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
