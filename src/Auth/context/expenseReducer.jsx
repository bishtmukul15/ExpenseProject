export const initialExpenseState = {
  expenses: [],
  totalAmount: 0,
  isPremium: false,
};

export function expenseReducer(state, action) {
  switch (action.type) {
    case "SET_EXPENSES":
      const total = action.payload.reduce((sum, e) => sum + +e.money, 0);
      return {
        ...state,
        expenses: action.payload,
        totalAmount: total,
        isPremium: total > 10000,
      };

    case "ADD_EXPENSE":
      const updatedExpenses = [...state.expenses, action.payload];
      const newTotal = updatedExpenses.reduce((sum, e) => sum + +e.money, 0);
      return {
        ...state,
        expenses: updatedExpenses,
        totalAmount: newTotal,
        isPremium: newTotal > 10000,
      };

    case "DELETE_EXPENSE":
      const filtered = state.expenses.filter((e) => e.id !== action.payload);
      const afterDelete = filtered.reduce((sum, e) => sum + +e.money, 0);
      return {
        ...state,
        expenses: filtered,
        totalAmount: afterDelete,
        isPremium: afterDelete > 10000,
      };

    default:
      return state;
  }
}
