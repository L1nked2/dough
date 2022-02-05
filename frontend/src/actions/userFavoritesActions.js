export const saveUserFavorites = (userFavorites) => {
  return {
    type: 'SAVE',
    payload: userFavorites
  };
}