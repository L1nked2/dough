export const initializeList = (list) => {
    return {
        type: 'INITIALIZE_LIST',
        payload: list
    };
};

export const likeChange = (rank) => {
    return {
        type: 'LIKE_CHANGE',
        payload: rank
    };
};