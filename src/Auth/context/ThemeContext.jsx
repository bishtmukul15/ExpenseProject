import React, { createContext, useReducer, useContext, useEffect } from "react";

// 🎯 Create context
const ThemeContext = createContext();

// 🎯 Reducer to handle theme state
function themeReducer(state, action) {
  switch (action.type) {
    case "TOGGLE_THEME":
      return state === "light" ? "dark" : "light";
    default:
      return state;
  }
}

// 🎯 Provider component
export const ThemeProvider = ({ children }) => {
  const [theme, dispatch] = useReducer(themeReducer, "light");

  // 🧠 Apply theme to <body> every time it changes
  useEffect(() => {
    document.body.classList.remove("light-theme", "dark-theme");
    document.body.classList.add(`${theme}-theme`);
  }, [theme]);

  const toggleTheme = () => {
    dispatch({ type: "TOGGLE_THEME" });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 🎯 Custom hook
export const useTheme = () => useContext(ThemeContext);
