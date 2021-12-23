export const sumScore = (score) => {
  return {
    type: "SUM_SCORE",
    payload: { score: score },
  };
};
export const addScore = (score) => {
  return {
    type: "ADD_SCORE",
    payload: { score: score },
  };
};
export const nextPage = () => {
  return {
    type: "NEXT_PAGE",
  };
}

export const previousPage = () => {
  return {
    type: "PREVIOUS_PAGE",
  };
}

export const reset = () => {
  return {
    type: "RESET",
  };
}
