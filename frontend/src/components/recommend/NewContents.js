import React from 'react';
import './NewContents.css';

import RecommendContent from './RecommendContent';

import { useSelector } from 'react-redux';

function NewContents(props) {
    const contents = useSelector(state => state.recommendPageInfo.newList);

    return (
        <div>
            {contents.map((elem, index) => {
                return (
                    <RecommendContent elem={elem} key={index} isSpecificType={true}/>
                );
            })}
        </div>
    );
}
  
export default NewContents;
  
