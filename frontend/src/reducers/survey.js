const initialState = {
    scores: [0,0,0,0,0,0,0,0,0],
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
    case "CHANGE_SCORE":
      var tempScores = [...state.scores];
      tempScores[action.payload.index] = action.payload.score;
      return {
        ...state,
        scores: tempScores
      };
    case "NEXT_PAGE":
      return {
        ...state,
        page: state.page + 1,
      };
    case "PREVIOUS_PAGE":
      var tempScores = [...state.scores];
      for (var i = state.page-1; i < tempScores.length; i++) {
        tempScores[i] = 0;
      }
      return {
        ...state,
        page: state.page - 1,
        scores: tempScores
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
