export function favouritesReducer(state, action) {
  switch (action.type) {
    case "LOAD_FAVORITES":
      return action.payload;

    case "TOGGLE_FAVORITE":
      return state.includes(action.payload)
        ? state.filter((id) => id !== action.payload)
        : [...state, action.payload];

    default:
      return state;
  }
}