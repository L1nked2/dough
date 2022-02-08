import homePageReducer from "./homePageInfo";
import recommendPageInfo from "./recommendPageInfo";
import myPlaceListReducer from "./myPlaceList";
import survey from "./survey";
import userInfoReducer from "./userInfo";
import userFavoritesReducer from "./userFavoritesReducer";

import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["userInfo"]
};

const allReducers = combineReducers({
    userInfo : userInfoReducer,
    homePageInfo : homePageReducer, 
    recommendPageInfo : recommendPageInfo,
    myPlaceList : myPlaceListReducer,
    survey : survey,
    userFavorites : userFavoritesReducer
});

export default persistReducer(persistConfig, allReducers);