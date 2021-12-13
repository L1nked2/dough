import homePageReducer from "./homePageInfo";
import myPlaceListReducer from "./myPlaceList";
import { combineReducers } from "redux";
import userInfoReducer from "./userInfo";

const allReducers = combineReducers({
    userInfo : userInfoReducer,
    homePageInfo : homePageReducer, 
    myPlaceList : myPlaceListReducer
});

export default allReducers;