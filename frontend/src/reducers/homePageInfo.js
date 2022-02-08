const initialState = {
    currLocation: {name: "위치 선택", line: "none", range: "none", spell: "none"},
    
    currCategory: 'food',
    foodPlaceList: [],
    cafePlaceList: [],
    drinkPlaceList: [],

    shopPageIsOpen: false,
    shopPageContent: null,
    locationPageIsOpen: false,
    menuModalIsOpen: false,
    slideShowPageIsOpen: false,

    fullFoodList:  ['돼지고기', '소고기', '스테이크/BBQ', '버거', '파스타/양식', '피자', '브런치', '샐러드', 
                    '일식 일반', '스시', '회', '돈가스', '멕시코', '베트남',
                    '인도', '태국', '세계', '한식 일반', '닭갈비', '국밥', '곱창', '닭발', '분식', 
                    '중식 일반', '딤섬', '양고기'],
    fullCafeList: ['카페 일반', '북카페', '차', '디저트/베이커리'],
    fullDrinkList: ['칵테일/양주', '하이볼/사케', '와인', '막걸리', '맥주/PUB', '맥주/호프', '소주/맥주'],
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
                    return {...state, foodPlaceList: action.payload.list}
                case "cafe":
                    return {...state, cafePlaceList: action.payload.list}
                case "drink":
                    return {...state, drinkPlaceList: action.payload.list}
            }
        case "CHANGE_CURRENT_CATEGORY":
            return {...state, currCategory: action.payload}
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
        case "OPEN_SLIDESHOW_PAGE":
            return {...state, slideShowPageIsOpen: true}
        case "CLOSE_SLIDESHOW_PAGE":
            return {...state, slideShowPageIsOpen: false}
        case "INITIAL_MENU_STATE":
            return {...state, 
                    tempFoodStateList: action.payload.tempFoodStateList, 
                    tempCafeStateList: action.payload.tempCafeStateList, 
                    tempDrinkStateList: action.payload.tempDrinkStateList,
                    initializedList: true}
        case "SET_SHOP_PAGE_CONTENTS":
            return {...state, shopPageContent: {...action.payload, prevLike: action.payload.place_likes}}
        case "APPLY_FOOD_LIST":
            return {...state, tempFoodStateList: action.payload}
        case "APPLY_CAFE_LIST":
            return {...state, tempCafeStateList: action.payload}
        case "APPLY_DRINK_LIST":
            return {...state, tempDrinkStateList: action.payload}
        case "TEMP_LIKE_CHANGE":
            return {...state, shopPageContent: {...state.shopPageContent, place_likes:action.payload}}
        case "LIKE_CHANGE":
            switch(action.payload.category){
                case "food":
                    var list = state.foodPlaceList.map((place) => {
                        if (place.place_uuid !== action.payload.uuid) {return place;}
                        else {return {...place, place_likes: !place.place_likes}}
                    });
                    return {...state, foodPlaceList: list}
                case "cafe":
                    var list = state.cafePlaceList.map((place) => {
                        if (place.place_uuid !== action.payload.uuid) {return place;}
                        else {return {...place, place_likes: !place.place_likes}}
                    });
                    return {...state, cafePlaceList: list}
                case "drink":
                    var list = state.drinkPlaceList.map((place) => {
                        if (place.place_uuid !== action.payload.uuid) {return place;}
                        else {return {...place, place_likes: !place.place_likes}}
                    });
                    return {...state, drinkPlaceList: list}
            }
        default:
            return state
    }
}

export default homePageReducer;