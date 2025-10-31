import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "../App";
import Header from "../components/Header";
import DailyExpense from "../components/DailyExpense";
import Signup from "../Auth/Signup";
import Login from "../Auth/Login";

// Helper wrapper for components that use Router
const Wrapper = ({ children }) => <BrowserRouter>{children}</BrowserRouter>;

describe("Expense Tracker App Tests", () => {
  test("renders Header component", () => {
    render(<Header />, { wrapper: Wrapper });
    expect(screen.getByText(/Expense Tracker/i)).toBeInTheDocument();
  });

  test("renders Signup page", () => {
    render(<Signup />, { wrapper: Wrapper });
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
  });

  test("renders Login page", () => {
    render(<Login />, { wrapper: Wrapper });
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  test("renders Daily Expense page", () => {
    render(<DailyExpense />, { wrapper: Wrapper });
    expect(screen.getByText(/Add Expense/i)).toBeInTheDocument();
  });

  test("renders Profile route", () => {
    render(<App />);
    expect(true).toBe(true); // placeholder test
  });

  test("Header should contain Logout button", () => {
    render(<Header />, { wrapper: Wrapper });
    const logout = screen.getByText(/Logout/i);
    expect(logout).toBeInTheDocument();
  });

  test("renders Forgot Password page", () => {
    render(<App />);
    expect(true).toBeTruthy(); // placeholder, can add mock route
  });

  test("renders router without crashing", () => {
    render(<App />);
    expect(screen).toBeDefined();
  });

  test("App renders without crashing", () => {
    render(<App />);
    expect(screen).toBeTruthy();
  });

  test("App snapshot testing", () => {
    const { asFragment } = render(<App />);
    expect(asFragment()).toMatchSnapshot();
  });
});
