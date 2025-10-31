export const initialAuthState = {
  token: localStorage.getItem("authToken") || null,
  userId: null,
  isLoggedIn: !!localStorage.getItem("authToken"),
};

export function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("authToken", action.payload.token);
      return {
        ...state,
        token: action.payload.token,
        userId: action.payload.userId,
        isLoggedIn: true,
      };

    case "LOGOUT":
      localStorage.removeItem("authToken");
      return { token: null, userId: null, isLoggedIn: false };

    default:
      return state;
  }
}
