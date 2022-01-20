const initialState = {userFavorites: null};

export default function userFavoritesReducer(state=initialState, action) {
  switch (action.type) {
    case "SAVE":
      return {userFavorites: action.payload};
    default:
      return state;
  }
}