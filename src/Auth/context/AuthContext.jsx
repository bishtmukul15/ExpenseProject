import React, { createContext, useReducer, useContext } from "react";
import { authReducer, initialAuthState } from "./authReducer";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  const login = (token, userId) => {
    dispatch({ type: "LOGIN", payload: { token, userId } });
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
