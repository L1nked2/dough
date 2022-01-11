const initialState = {
    testResult: {},
    name: '구름',
    myType: '주택가 레스토랑',
    retestModalIsOpen: false,
}

function userInfoReducer (state = initialState, action) {
    switch(action.type){
        case "REFRESH_RESULT":
            return {...state, testResult: action.payload}
        case "OPEN_RETEST_MODAL":
            return {...state, retestModalIsOpen: true}
        case "CLOSE_RETEST_MODAL":
            return {...state, retestModalIsOpen: false}
        default:
            return state
    }
}

export default userInfoReducer;