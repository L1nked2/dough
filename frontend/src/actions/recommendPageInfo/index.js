export const initializeRecommendList = (headerList, myTypeList, newList, otherTypeList) => {
    return {
        type: 'INITIALIZE_RECOMMEND_LIST',
        payload: {
            headerList: headerList,
            myTypeList: myTypeList,
            newList: newList,
            otherTypeList: otherTypeList,
        }
    };
};

export const openListPage = () => {
    return {type: 'OPEN_LIST_PAGE'};
};
export const closeListPage = () => {
    return {type: 'CLOSE_LIST_PAGE'};
};
export const setListPageContents = (contents) => {
    return {
        type: 'SET_LIST_PAGE_CONTENTS',
        payload: contents
    };
};

export const openCurationPage = () => {
    return {type: 'OPEN_CURATION_PAGE'};
};
export const closeCurationPage = () => {
    return {type: 'CLOSE_CURATION_PAGE'};
};
export const setCurationPageContents = (contents) => {
    return {
        type: 'SET_CURATION_PAGE_CONTENTS',
        payload: contents
    };
};