import React, { createContext, useReducer, useContext } from "react";
import { expenseReducer, initialExpenseState } from "./expenseReducer";

const ExpenseContext = createContext();

export function ExpenseProvider({ children }) {
  const [state, dispatch] = useReducer(expenseReducer, initialExpenseState);

  const setExpenses = (data) =>
    dispatch({ type: "SET_EXPENSES", payload: data });

  const addExpense = (expense) =>
    dispatch({ type: "ADD_EXPENSE", payload: expense });

  const deleteExpense = (id) =>
    dispatch({ type: "DELETE_EXPENSE", payload: id });

  return (
    <ExpenseContext.Provider
      value={{
        ...state,
        setExpenses,
        addExpense,
        deleteExpense,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export const useExpense = () => useContext(ExpenseContext);
