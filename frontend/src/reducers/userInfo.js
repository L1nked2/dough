const initialState = {
    testResult: {},
    name: '구름',
    myType: '주택가 레스토랑',
}

function userInfoReducer (state = initialState, action) {
    switch(action.type){
        case "REFRESH_RESULT":
            return {...state, testResult: action.payload}
        default:
            return state
    }
}

export default userInfoReducer;