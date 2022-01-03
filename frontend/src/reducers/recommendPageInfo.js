const initialState = {
    listPageIsOpen: false,
    listPageContent: {},
    curationPageIsOpen: false,
    curationPageContent: {},
    headerList: [],
    myTypeList: [],
    newList: [],
    otherTypeList: [],
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
        case "OPEN_LIST_PAGE":
            return {...state, listPageIsOpen: true}
        case "CLOSE_LIST_PAGE":
            return {...state, listPageIsOpen: false}
        case "SET_LIST_PAGE_CONTENTS":
            return {...state, listPageContent: action.payload}
        case "OPEN_CURATION_PAGE":
            return {...state, curationPageIsOpen: true}
        case "CLOSE_CURATION_PAGE":
            return {...state, curationPageIsOpen: false}
        case "SET_CURATION_PAGE_CONTENTS":
            return {...state, curationPageContent: action.payload}
        default:
            return state
    }
}

export default homePageReducer;