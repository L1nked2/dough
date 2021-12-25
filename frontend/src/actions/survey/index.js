export const sumScore = (score) => {
  return {
    type: "SUM_SCORE",
    payload: { score: score },
  };
};
export const changeScore = (index, score) => {
  return {
    type: "CHANGE_SCORE",
    payload: { index: index, score: score },
  };
};
export const nextPage = (page) => {
  window.history.pushState({page: `survey ${page}`}, `survey ${page}`);
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
