const initialState = {
    testResult: {},
    name: '신혜영',
    imgFile: '', 
    imgPreviewURL: '',
    myType: '주택가 레스토랑',
    cluster: -1,
    currentList: [],
}

function userInfoReducer (state = initialState, action) {
    switch(action.type){
        case "CHANGE_NAME":
            return {...state, name: action.payload}
        case "CHANGE_PROFILE_IMG":
            return {...state, imgFile: action.payload.imgFile, imgPreviewURL: action.payload.imgPreviewURL}
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