export const changeLocation = (name, line, spell, range) => {
    return {
        type: 'CHANGE_LOCATION',
        payload: {name: name, line: line, spell:spell, range: range}
    };
};
export const changeContent = (category, list) => {
    return {
        type: 'CHANGE_CONTENT',
        payload: {category: category, list: list}
    };
};
export const changeCurrentCategory = (category) => {
    return {
        type: 'CHANGE_CURRENT_CATEGORY',
        payload: category
    };
};

export const openShopPage = () => {
    return {type: 'OPEN_SHOP_PAGE'};
};
export const closeShopPage = () => {
    return {type: 'CLOSE_SHOP_PAGE'};
};
export const openLocationPage = () => {
    return {type: 'OPEN_LOCATION_PAGE'};
};
export const closeLocationPage = () => {
    return {type: 'CLOSE_LOCATION_PAGE'};
};
export const openMenuModal = () => {
    return {type: 'OPEN_MENU_MODAL'};
};
export const closeMenuModal = () => {
    return {type: 'CLOSE_MENU_MODAL'};
};
export const openSlideshowPage = () => {
    return {type: 'OPEN_SLIDESHOW_PAGE'};
};
export const closeSlideshowPage = () => {
    return {type: 'CLOSE_SLIDESHOW_PAGE'};
};

export const initialMenuState = (foodList, CafeList, drinkList) => {
    const stateFoodTemp = [];
    const stateCafeTemp = [];
    const stateDrinkTemp = [];
    for (const [index, menu] of foodList.entries()){
        stateFoodTemp.push({id: index, menu: menu, active:false})
    }
    for (const [index, menu] of CafeList.entries()){
        stateCafeTemp.push({id: index, menu: menu, active:false})
    }
    for (const [index, menu] of drinkList.entries()){
        stateDrinkTemp.push({id: index, menu: menu, active:false})
    } 
    return {
        type: 'INITIAL_MENU_STATE',
        payload: {
            tempFoodStateList: stateFoodTemp,
            tempCafeStateList: stateCafeTemp,
            tempDrinkStateList: stateDrinkTemp
        }
    };
};

export const setShopPageContents = (contents) => {
    return {
        type: 'SET_SHOP_PAGE_CONTENTS',
        payload: contents
    };
};
export const applyFoodList = (list) => {
    return {
        type: 'APPLY_FOOD_LIST',
        payload: list
    };
};
export const applyCafeList = (list) => {
    return {
        type: 'APPLY_CAFE_LIST',
        payload: list
    };
};
export const applyDrinkList = (list) => {
    return {
        type: 'APPLY_DRINK_LIST',
        payload: list
    };
};
export const tempLikeChange = (like) => {
    return {
        type: 'TEMP_LIKE_CHANGE',
        payload: like
    };
};
export const likeChange = (category, uuid) => {
    return {
        type: 'LIKE_CHANGE',
        payload: {category: category, uuid: uuid}
    };
};