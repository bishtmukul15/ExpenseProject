import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Signup from "./Auth/Signup";
import Login from "./Auth/Login";
import Profile from "./components/Profile";
import Logout from "./Auth/Logout";
import ForgotPassword from "./Auth/ForgotPassword";
import DailyExpense from "./components/DailyExpense";
import { AuthProvider } from "../src/Auth/context/AuthContext";
import { ExpenseProvider } from "../src/Auth/context/ExpenseContext";

const App = () => {
  return (
    <AuthProvider>
      <ExpenseProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/daily-expense" element={<DailyExpense />} />
          </Routes>
        </Router>
      </ExpenseProvider>
    </AuthProvider>
  );
};

export default App;
