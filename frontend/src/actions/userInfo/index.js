export const refreshResult = (result) => {
    return {
        type: 'REFRESH_RESULT',
        payload: result
    };
};

export const setCluster = (cluster) => {
    return {
        type: 'SET_CLUSTER',
        payload: cluster
    };
};

export const appendCurrentShop = (uuid) => {
    return {
        type: 'APPEND_CURRENT_SHOP',
        payload: uuid
    };
};
