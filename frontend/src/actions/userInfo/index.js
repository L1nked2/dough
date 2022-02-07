export const changeName = (name) => {
    return {
        type: 'CHANGE_NAME',
        payload: name
    };
};

export const changeProfileImg = (file, previewURL) => {
    return {
        type: 'CHANGE_PROFILE_IMG',
        payload: {imgFile: file, imgPreviewURL: previewURL}
    };
};

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
