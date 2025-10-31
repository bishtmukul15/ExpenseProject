import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css"; // ✅ Correct CSS import
import Header from "./components/Header";
import Signup from "./Auth/Signup";
import Login from "./Auth/Login";
import Profile from "./components/Profile";
import Logout from "./Auth/Logout";
import ForgotPassword from "./Auth/ForgotPassword";
import DailyExpense from "./components/DailyExpense";
import { AuthProvider } from "./Auth/context/AuthContext";
import { ExpenseProvider } from "./Auth/context/ExpenseContext";
import { ThemeProvider } from "./Auth/context/ThemeContext";

const App = () => {
  return (
    <AuthProvider>
      <ExpenseProvider>
        <ThemeProvider>
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
        </ThemeProvider>
      </ExpenseProvider>
    </AuthProvider>
  );
};

export default App;
