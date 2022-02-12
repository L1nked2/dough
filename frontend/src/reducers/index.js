import homePageReducer from "./homePageInfo";
import recommendPageInfo from "./recommendPageInfo";
import myPlaceListReducer from "./myPlaceList";
import survey from "./survey";
import userInfoReducer from "./userInfo";
import userFavoritesReducer from "./userFavoritesReducer";

import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage/session";

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["userInfo", "homePageInfo"] // local storage에 저장 --> 추후 api로 받아오는 것으로 변경할 예정
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