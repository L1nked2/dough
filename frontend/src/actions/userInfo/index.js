export const refreshResult = (result) => {
    return {
        type: 'REFRESH_RESULT',
        payload: result
    };
};
export const openRetestModal = () => {
    return {
        type: 'OPEN_RETEST_MODAL'
    };
};
export const closeRetestModal = () => {
    return {
        type: 'CLOSE_RETEST_MODAL'
    };
};