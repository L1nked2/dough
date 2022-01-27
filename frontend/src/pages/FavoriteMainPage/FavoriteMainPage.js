import React, {useEffect, useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import './FavoriteMainPage.css'

import Header from '../../components/common/Header'
import SubHeader from './components/SubHeader'
import CategorySelector from './components/CategorySelector'
import StationSwiperContainer from './components/StationSwiperContainer'
import Navbar from '../../components/common/Navbar'

import { saveUserFavorites } from '../../actions/userFavoritesActions'

function FavoriteMainPage(props){
  const [category, setCategory] = useState("rest") // ["rest", "cafe", "bar"] 

  const userFavorites = useSelector((state) => state.userFavorites.userFavorites);
  const dispatch = useDispatch();
  useEffect(() => {
    // fetch user favorite json from server with axios
    // with Promise
    axios({
        method: 'get',
        url: 'https://dough-survey.web.app/api/info/user',
        headers: {
            "Content-type" : "application/json"
        },
        data : {
            userToken: ""
        }
    }).then( (response) => {
        ////// temporary dummy data
        //console.log(response.data.userInfo.user_favorites);
        //dispatch(saveUserFavorites(example_user_favorite.user_favorites));
        
        ////// actual code
        dispatch(saveUserFavorites(response.data.userInfo.user_favorites));
    });
    
  }, 
  [] // <--------TODO : userFavorites.last_modified 를 넣을 것 (last_modified : user가 
  // 찜한 가게 list 바꾸면 그때의 timestamp) 
  // userFavorites 전체를 비교해 버리면, object간 비교가 되어서 계속 api request 하게 됨
  ); // run again only if userFavorites have changed

  return (
    <div className="favoriteMainPage">
      <Header changeIsHome={props.changeIsHome}/>
      <SubHeader/>
      <CategorySelector 
        category={category} 
        setCategory ={(newCategory)=>{setCategory(newCategory)}} 
        userFavorites={userFavorites}
      />
      <StationSwiperContainer 
        category={category}
        userFavorites={userFavorites}  
      />
      <Navbar page="favorite_main"/>
    </div>
  );
}

export default FavoriteMainPage;


const example_user_favorite = {
  "user_favorites": {
      "rest": {
          "264a8047-4b2b-5c4b-935f-37fe710e5272": {
              "station_name": "합정역",
              "station_thumbnail_inside": "https://i.kym-cdn.com/photos/images/newsfeed/001/878/329/dfa.jpg",
              "station_thumbnail_food": "https://i.kym-cdn.com/photos/images/newsfeed/001/878/329/dfa.jpg",
              "place_list": [
                  {
                      "place_uuid": "002b7a00-95a7-52a1-8e81-6338fea1d6c2",
                      "place_name": "합정역 맛집 No.1",
                      "place_thumbnail_inside": "https://i.kym-cdn.com/photos/images/newsfeed/001/878/329/dfa.jpg",
                      "place_thumbnail_food": "https://i.kym-cdn.com/photos/images/newsfeed/001/878/329/dfa.jpg"
                  },
                  {
                      "place_uuid": "002b7a00-95a7-52a1-8e81-6338fea1d6c2",
                      "place_name": "합정역 맛집 No.2",
                      "place_thumbnail_inside": "https://i.kym-cdn.com/photos/images/newsfeed/001/878/329/dfa.jpg",
                      "place_thumbnail_food": "https://i.kym-cdn.com/photos/images/newsfeed/001/878/329/dfa.jpg"
                  },
                  {
                      "place_uuid": "002b7a00-95a7-52a1-8e81-6338fea1d6c2",
                      "place_name": "합정역 맛집 No.3",
                      "place_thumbnail_inside": "https://i.kym-cdn.com/photos/images/newsfeed/001/878/329/dfa.jpg",
                      "place_thumbnail_food": "https://i.kym-cdn.com/photos/images/newsfeed/001/878/329/dfa.jpg"
                  }
              ]
          },
          "2a2fb6a8-e995-515c-a24b-849030c8d8ea": {
              "station_name": "강남역",
              "station_thumbnail_inside": "https://i.kym-cdn.com/photos/images/newsfeed/001/878/329/dfa.jpg",
              "station_thumbnail_food": "https://i.kym-cdn.com/photos/images/newsfeed/001/878/329/dfa.jpg",
              "place_list": [
                  {
                      "place_uuid": "002b7a00-95a7-52a1-8e81-6338fea1d6c2",
                      "place_name": "강남역 맛집 No.1",
                      "place_thumbnail_inside": "https://i.kym-cdn.com/photos/images/newsfeed/001/878/329/dfa.jpg",
                      "place_thumbnail_food": "https://i.kym-cdn.com/photos/images/newsfeed/001/878/329/dfa.jpg"
                  },
                  {
                      "place_uuid": "002b7a00-95a7-52a1-8e81-6338fea1d6c2",
                      "place_name": "강남역 맛집 No.2",
                      "place_thumbnail_inside": "https://i.kym-cdn.com/photos/images/newsfeed/001/878/329/dfa.jpg",
                      "place_thumbnail_food": "https://i.kym-cdn.com/photos/images/newsfeed/001/878/329/dfa.jpg"
                  },
                  {
                      "place_uuid": "002b7a00-95a7-52a1-8e81-6338fea1d6c2",
                      "place_name": "강남역 맛집 No.3",
                      "place_thumbnail_inside": "https://i.kym-cdn.com/photos/images/newsfeed/001/878/329/dfa.jpg",
                      "place_thumbnail_food": "https://i.kym-cdn.com/photos/images/newsfeed/001/878/329/dfa.jpg"
                  }
              ]
          }
      },
      "cafe": {
      },
      "bar": {
          "2a2fb6a8-e995-515c-a24b-849030c8d8ea": {
              "station_name": "강남역",
              "station_thumbnail_inside": "https://i.kym-cdn.com/photos/images/newsfeed/001/878/329/dfa.jpg",
              "station_thumbnail_food": "https://i.kym-cdn.com/photos/images/newsfeed/001/878/329/dfa.jpg",
              "place_list": [
                  {
                      "place_uuid": "002b7a00-95a7-52a1-8e81-6338fea1d6c2",
                      "place_name": "강남역 술집 No.1",
                      "place_thumbnail_inside": "https://i.kym-cdn.com/photos/images/newsfeed/001/878/329/dfa.jpg",
                      "place_thumbnail_food": "https://i.kym-cdn.com/photos/images/newsfeed/001/878/329/dfa.jpg"
                  },
                  {
                      "place_uuid": "002b7a00-95a7-52a1-8e81-6338fea1d6c2",
                      "place_name": "강남역 술집 No.2",
                      "place_thumbnail_inside": "https://i.kym-cdn.com/photos/images/newsfeed/001/878/329/dfa.jpg",
                      "place_thumbnail_food": "https://i.kym-cdn.com/photos/images/newsfeed/001/878/329/dfa.jpg"
                  },
                  {
                      "place_uuid": "002b7a00-95a7-52a1-8e81-6338fea1d6c2",
                      "place_name": "강남역 술집 No.3",
                      "place_thumbnail_inside": "https://i.kym-cdn.com/photos/images/newsfeed/001/878/329/dfa.jpg",
                      "place_thumbnail_food": "https://i.kym-cdn.com/photos/images/newsfeed/001/878/329/dfa.jpg"
                  }
              ]
          }
      }
  }
};