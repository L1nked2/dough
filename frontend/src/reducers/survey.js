const initialState = {
    scores: [],
    score: 0,
    page: 0, // 0: 인트로 페이지, 1 ~ quizs.length: 퀴즈 페이지, quizs.length + 1: 마지막 페이지
    quizs: ["../../img/restaurant/download.jpg",
            "../../img/restaurant/download1.jpg",
            "../../img/restaurant/download2.jpg",
            "../../img/restaurant/download.jpg",
            "../../img/restaurant/download1.jpg",
            "../../img/restaurant/download2.jpg",
            "../../img/restaurant/download.jpg",
            "../../img/restaurant/download1.jpg",
            "../../img/restaurant/download2.jpg",],
};
  
export default function survey(state = initialState, action) {
  switch (action.type) {
    case "SUM_SCORE":
      return {
        ...state,
        score: state.score + action.payload.score,
      };
    case "ADD_SCORE":
      return {
        ...state,
        scores: [...state.scores, action.payload.score,]
      };
    case "NEXT_PAGE":
      return {
        ...state,
        page: state.page + 1,
      };
    case "PREVIOUS_PAGE":
      return {
        ...state,
        page: state.page - 1,
      };
    case "RESET":
      return {
        ...state,
        score: 0,
        page: 0,
      };
    default:
      return state;
  }
}
