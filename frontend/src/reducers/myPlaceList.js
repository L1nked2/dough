const initialState = [];

function myPlaceListReducer (state = initialState, action) {
    switch(action.type){
        case "INITIALIZE_LIST": 
            return action.payload
        case "LIKE_CHANGE":
            return state.map(place => {
                if (place.rank !== action.payload) { return place; }
                else { return {...place, like: !place.like}; }
            })
        default: 
            return state 
    }
}

export default myPlaceListReducer;