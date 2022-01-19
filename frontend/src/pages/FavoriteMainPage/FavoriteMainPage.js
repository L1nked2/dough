import React, {useEffect, useState} from 'react'
import './FavoriteMainPage.css'

import Header from '../../components/common/Header'
import SubHeader from './components/SubHeader'
import CategorySelector from './components/CategorySelector'
import StationSwiperContainer from './components/StationSwiperContainer'
import Navbar from '../../components/common/Navbar'

function FavoriteMainPage(props){
  const [category, setCategory] = useState("restr") // ["restr", "cafe", "bar"] 

  const [userFavorites, setUserFavorites] = useState({});
  useEffect(() => {
    // fetch user favorite json from server with axios
    setUserFavorites(example_user_favorite);
    console.log("fetch new user favorites data");
  }, [userFavorites]); // run again only if userFavorites have changed


  return (
    <div className="favoriteMainPage">
      <Header changeIsHome={props.changeIsHome}/>
      <SubHeader/>
      <CategorySelector 
        category={category} 
        setCategory ={(newCategory)=>{setCategory(newCategory)}} 
      />
      <StationSwiperContainer category={category}/>
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
          "264a8047-4b2b-5c4b-935f-37fe710e5272": {
              "station_name": "합정역",
              "station_thumbnail_inside": "https://i.kym-cdn.com/photos/images/newsfeed/001/878/329/dfa.jpg",
              "station_thumbnail_food": "https://i.kym-cdn.com/photos/images/newsfeed/001/878/329/dfa.jpg",
              "place_list": [
                  {
                      "place_uuid": "002b7a00-95a7-52a1-8e81-6338fea1d6c2",
                      "place_name": "합정역 카페 No.1",
                      "place_thumbnail_inside": "https://i.kym-cdn.com/photos/images/newsfeed/001/878/329/dfa.jpg",
                      "place_thumbnail_food": "https://i.kym-cdn.com/photos/images/newsfeed/001/878/329/dfa.jpg"
                  },
                  {
                      "place_uuid": "002b7a00-95a7-52a1-8e81-6338fea1d6c2",
                      "place_name": "합정역 카페 No.2",
                      "place_thumbnail_inside": "https://i.kym-cdn.com/photos/images/newsfeed/001/878/329/dfa.jpg",
                      "place_thumbnail_food": "https://i.kym-cdn.com/photos/images/newsfeed/001/878/329/dfa.jpg"
                  },
                  {
                      "place_uuid": "002b7a00-95a7-52a1-8e81-6338fea1d6c2",
                      "place_name": "합정역 카페 No.3",
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
                      "place_name": "강남역 카페 No.1",
                      "place_thumbnail_inside": "https://i.kym-cdn.com/photos/images/newsfeed/001/878/329/dfa.jpg",
                      "place_thumbnail_food": "https://i.kym-cdn.com/photos/images/newsfeed/001/878/329/dfa.jpg"
                  },
                  {
                      "place_uuid": "002b7a00-95a7-52a1-8e81-6338fea1d6c2",
                      "place_name": "강남역 카페 No.2",
                      "place_thumbnail_inside": "https://i.kym-cdn.com/photos/images/newsfeed/001/878/329/dfa.jpg",
                      "place_thumbnail_food": "https://i.kym-cdn.com/photos/images/newsfeed/001/878/329/dfa.jpg"
                  },
                  {
                      "place_uuid": "002b7a00-95a7-52a1-8e81-6338fea1d6c2",
                      "place_name": "강남역 카페 No.3",
                      "place_thumbnail_inside": "https://i.kym-cdn.com/photos/images/newsfeed/001/878/329/dfa.jpg",
                      "place_thumbnail_food": "https://i.kym-cdn.com/photos/images/newsfeed/001/878/329/dfa.jpg"
                  }
              ]
          }
      },
      "bar": {
          "264a8047-4b2b-5c4b-935f-37fe710e5272": {
              "station_name": "합정역",
              "station_thumbnail_inside": "https://i.kym-cdn.com/photos/images/newsfeed/001/878/329/dfa.jpg",
              "station_thumbnail_food": "https://i.kym-cdn.com/photos/images/newsfeed/001/878/329/dfa.jpg",
              "place_list": [
                  {
                      "place_uuid": "002b7a00-95a7-52a1-8e81-6338fea1d6c2",
                      "place_name": "합정역 술집 No.1",
                      "place_thumbnail_inside": "https://i.kym-cdn.com/photos/images/newsfeed/001/878/329/dfa.jpg",
                      "place_thumbnail_food": "https://i.kym-cdn.com/photos/images/newsfeed/001/878/329/dfa.jpg"
                  },
                  {
                      "place_uuid": "002b7a00-95a7-52a1-8e81-6338fea1d6c2",
                      "place_name": "합정역 술집 No.2",
                      "place_thumbnail_inside": "https://i.kym-cdn.com/photos/images/newsfeed/001/878/329/dfa.jpg",
                      "place_thumbnail_food": "https://i.kym-cdn.com/photos/images/newsfeed/001/878/329/dfa.jpg"
                  },
                  {
                      "place_uuid": "002b7a00-95a7-52a1-8e81-6338fea1d6c2",
                      "place_name": "합정역 술집 No.3",
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