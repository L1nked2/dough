const initialState = {
    testResult: {},
    name: '구름',
    myType: '주택가 레스토랑',
    cluster: -1,
    currentList: [],
}

function userInfoReducer (state = initialState, action) {
    switch(action.type){
        case "REFRESH_RESULT":
            return {...state, testResult: action.payload}
        case "SET_CLUSTER":
            return {...state, cluster: action.payload}
        case "APPEND_CURRENT_SHOP":
            return {...state, currentList: [action.payload, ...state.currentList.filter(shop=>shop.place_uuid !== action.payload.place_uuid).slice(0,9)]}
        default:
            return state
    }
}

export default userInfoReducer;