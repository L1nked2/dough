export const initializeRecommendList = (props) => {
    return {
        type: 'INITIALIZE_RECOMMEND_LIST',
        payload: {
            headerList: props.headerList,
            myTypeList: props.myTypeList,
            newList: props.newList,
            otherTypeList: props.otherTypeList,
        }
    };
};