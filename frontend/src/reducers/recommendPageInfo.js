const initialState = {
    shopPageIsOpen: false,
    shopPageContent: {},
    listPageIsOpen: false,
    listPageContent: {},
    headerList = [],
    myTypeList = [],
    newList = [],
    otherTypeList = [],
}

function homePageReducer (state = initialState, action) {
    switch(action.type){
        case "INITIALIZE_RECOMMEND_LIST":
            return {...state, 
                    headerList: action.payload.headerList,
                    myTypeList: action.payload.myTypeList,
                    newList: action.payload.newList,
                    otherTypeList: action.payload.otherTypeList
                }
        default:
            return state
    }
}

export default homePageReducer;