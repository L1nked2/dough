import homePageReducer from "./homePageInfo";
import recommendPageInfo from "./recommendPageInfo";
import myPlaceListReducer from "./myPlaceList";
import survey from "./survey";
import { combineReducers } from "redux";
import userInfoReducer from "./userInfo";
import userFavoritesReducer from "./userFavoritesReducer";

const allReducers = combineReducers({
    userInfo : userInfoReducer,
    homePageInfo : homePageReducer, 
    recommendPageInfo : recommendPageInfo,
    myPlaceList : myPlaceListReducer,
    survey : survey,
    userFavorites : userFavoritesReducer
});

export default allReducers;