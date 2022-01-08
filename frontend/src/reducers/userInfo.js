const initialState = {
    testResult: {
        title: '골목길 이자카야',
        value1: 80,
        value2: 30,
        value3: 60,
        value4: 40
    },
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