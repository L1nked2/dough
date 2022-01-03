const initialState = {
    currLocation: {name: "위치 선택", line: "none", range: "none"},
    
    foodPlaceList: [],
    cafePlaceList: [],
    drinkPlaceList: [],

    shopPageIsOpen: false,
    shopPageContent: {},
    locationPageIsOpen: false,
    menuModalIsOpen: false,
    fullFoodList:  ['분식', '곱창', '닭발', '국밥', '백반', '돼지고기', '돈카츠', '닭갈비', '소고기', 
                    '일본가정식', '일본카레', '오믈렛', '회', '스시', '샐러드', '샌드위치', '브런치',
                    '수제버거', '파스타', '피자', '스테이크', '베트남', '멕시코', '인도', '태국', '양꼬치', 
                    '중국집', '마라탕,마라샹궈,훠궈', '딤섬'],
    fullCafeList: ['카페 일반', '북카페', '차', '디저트/베이커리'],
    fullDrinkList: ['칵테일바', '하이볼', '와인', '수제맥주', '소주,맥주', '양주', '막걸리', '사케'],
    tempFoodStateList: [],
    tempCafeStateList: [],
    tempDrinkStateList: [], // 초기화 필요
    initializedList: false,

}

function homePageReducer (state = initialState, action) {
    switch(action.type){
        case "CHANGE_LOCATION":
            return {...state, currLocation: action.payload}
        case "CHANGE_CONTENT":
            switch(action.payload.category){
                case "food":
                    return {...state, foodPlaceList: action.payload.placeList}
                case "cafe":
                    return {...state, cafePlaceList: action.payload.placeList}
                case "drink":
                    return {...state, drinkPlaceList: action.payload.placeList}
            }
        case "OPEN_SHOP_PAGE":
            return {...state, shopPageIsOpen: true}
        case "CLOSE_SHOP_PAGE":
            return {...state, shopPageIsOpen: false}
        case "OPEN_LOCATION_PAGE":
            return {...state, locationPageIsOpen: true}
        case "CLOSE_LOCATION_PAGE":
            return {...state, locationPageIsOpen: false}
        case "OPEN_MENU_MODAL":
            return {...state, menuModalIsOpen: true}
        case "CLOSE_MENU_MODAL":
            return {...state, menuModalIsOpen: false}
        case "INITIAL_MENU_STATE":
            return {...state, 
                    tempFoodStateList: action.payload.tempFoodStateList, 
                    tempCafeStateList: action.payload.tempCafeStateList, 
                    tempDrinkStateList: action.payload.tempDrinkStateList,
                    initializedList: true}
        case "SET_SHOP_PAGE_CONTENTS":
            return {...state, shopPageContent: action.payload}
        case "APPLY_FOOD_LIST":
            return {...state, tempFoodStateList: action.payload}
        case "APPLY_CAFE_LIST":
            return {...state, tempCafeStateList: action.payload}
        case "APPLY_DRINK_LIST":
            return {...state, tempDrinkStateList: action.payload}
        case "TEMP_LIKE_CHANGE":
            return {...state, shopPageContent: {...state.shopPageContent, like:!state.shopPageContent.like}}
        default:
            return state
    }
}

export default homePageReducer;