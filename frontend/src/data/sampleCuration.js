import img1_1_1 from './curation/01/1_1.jpeg';
import img1_1_2 from './curation/01/1_2.jpeg';
import img1_1_3 from './curation/01/1_3.jpeg';
import img1_1_4 from './curation/01/1_4.jpeg';
import img1_2_1 from './curation/01/2_1.jpg';
import img1_2_2 from './curation/01/2_2.jpeg';
import img1_2_3 from './curation/01/2_3.jpeg';
import img1_2_4 from './curation/01/2_4.jpeg';
import img1_3_1 from './curation/01/3_1.jpg';
import img1_3_2 from './curation/01/3_2.jpeg';
import img1_3_3 from './curation/01/3_3.jpeg';
import img1_3_4 from './curation/01/3_4.jpeg';
import img2_1_1 from './curation/02/1_1.jpg';
import img2_1_2 from './curation/02/1_2.jpg';
import img2_1_3 from './curation/02/1_3.jpg';
import img2_2_1 from './curation/02/2_1.jpg';
import img2_2_2 from './curation/02/2_2.jpg';
import img2_2_3 from './curation/02/2_3.jpg';
import img2_2_4 from './curation/02/2_4.jpg';
import img2_2_5 from './curation/02/2_5.jpg';
import img2_3_1 from './curation/02/3_1.jpg';
import img2_3_2 from './curation/02/3_2.jpg';
import img2_3_3 from './curation/02/3_3.jpg';
import mainImg1 from './result/01.png';
import mainImg2 from './result/02.png';
import mainImg3 from './result/03.png';

export const mainCuration = {
    title: "늘어진 수건형의 취향저격\n성수역 카페 & 맛집",
    subTitle: "따뜻한 감성을 지닌 성수역 주변 가게", 
    contents: [
        {
            name: "카페할아버지공장",
            uuid: "???",
            station: "성수",
            distance: "400m",
            price: "8000",
            menu: "카페",
            like: false,
            mainPhoto: mainImg1,
            placePhotoList: [img1_1_1, img1_1_2, img1_1_3, img1_1_4],
            summary: "자연을 한껏 느낄 수 있는 정원 느낌의 카페",
            discription: "카페할아버지공장은 놀면뭐하니 싹쓰리 촬영장소로, 햇볕이 정말 잘 드는 건물내 공간과 야외 정원, 그리고 곳곳에 세워진 소품들이 조화롭게 어우러진 분위기입니다. 진한 향의 커피와 함께 파스타와 피자, 샐러드도 판매하고 있어 식사도 곁들일 수 있답니다 :)",
            tags: "#이마트 성수점 주차장 이용",
            parameter1: "80",
            parameter2: "75",
            parameter3: "40",
            parameter4: "85",
        },
        {
            name: "호호식당",
            uuid: "???",
            station: "성수",
            distance: "800m",
            price: "17000",
            menu: "일식 일반",
            like: false,
            mainPhoto: mainImg2,
            placePhotoList: [img1_2_1, img1_2_2, img1_2_3, img1_2_4],
            summary: "사케동과 돈카츠가 맛있는 벽돌집 느낌의 일식당",
            discription: "호호식당은 1970년대 벽돌집 느낌이 공존하는 따뜻한 인테리어가 특징인 가게입니다. 사케동과 가츠나베 정식이 대표 메뉴이며, 메뉴가 다양하니 여러 메뉴를 시켜 함께 나눠 드시는 것을 추천드려요 :)",
            tags: "#성동구민종합센터 부설주차장 이용 #4인 가능 #네이버 예약 가능",
            parameter1: "85",
            parameter2: "90",
            parameter3: "15",
            parameter4: "65",
        },
        {
            name: "퀴버",
            uuid: "???",
            station: "성수",
            distance: "700m",
            price: "23000",
            menu: "파스타/양식",
            like: false,
            mainPhoto: mainImg3,
            placePhotoList: [img1_3_1, img1_3_2, img1_3_3, img1_3_4],
            summary: "이탈리안 요리를 한국 스타일로 재 해석한 맛있는 파스타집",
            discription: "퀴버는 통유리로 디자인한 개방감 있는 내부 인테리어가 특징인 가게입니다.다양한 파스타와 리조또, 스테이크를 판매하고 있으며 정말 맛있는 음식이 특징인 가게입니다.",
            tags: "#성동구민종합센터 부설주차장 이용 #4인 가능 #전화 예약 가능",
            parameter1: "90",
            parameter2: "95",
            parameter3: "15",
            parameter4: "55",
        },
    ]
}
  

export const sampleCuration = {
    title: "따뜻한 감성의\n가로수길 가게 3곳",
    subTitle: "편안한 힐링의 공간, 가로수길 핫한 가게", 
    contents: [
      {
          name: "을지다락 가로수길",
          uuid: "???",
          station: "신사",
          distance: "683m",
          price: "13000",
          menu: "파스타/양식",
          like: false,
          placePhotoList: [img2_1_1, img2_1_2, img2_1_3],
          summary: "아담하고 포근한 분위기를 가진 일본 가정식 식당",
          discription: "을지다락은 포근하고 귀여운 분위기를 담고있는 일본 가정식 식당의 인테리어를 가진 가게입니다. 다락오므라이스, 가츠산도, 매콤크림파스타 등 다양한 파스타와 함께 경양식 음식을 판매하고 있어요!",
          tags: "#신구초교 공영주차장 이용 #4인 가능 #네이버 예약 가능"
      },
      {
          name: "소진담",
          uuid: "???",
          station: "신사",
          distance: "627m",
          price: "9000",
          menu: "디저트/베이커리",
          like: false,
          placePhotoList: [img2_2_1, img2_2_2, img2_2_3, img2_2_4, img2_2_5],
          summary: "케이크가 맛있는 모던한 분위기의 가로수길 뷰 맛집 카페",
          discription: "소진담은 자연채광이 정말 잘 드는 모던한 분위기의 카페입니다. 멋진 인테리어 뿐만 아니라, 맛있는 케이크가 대표 메뉴이며, 내부 공간이 넓어 단체 모임에 적합합니다!",
          tags: "#신구초교 공영주차장 이용 #8인 가능"
      },
      {
          name: "청수당",
          uuid: "???",
          station: "신사",
          distance: "609m",
          price: "13000",
          menu: "디저트/베이커리",
          like: false,
          placePhotoList: [img2_3_1, img2_3_2, img2_3_3],
          summary: "수플레 카스테라가 유명한 따스한 분위기의 카페",
          discription: "청수당은 고즈넉한 분위기와 자연 채광, 연못이 어우러져 도심 속에서 한적한 분위기를 느끼게 해주는 한옥 인테리어가 특징인 가게입니다. 수플레 카스테라가 대표적인 디저트이며, 이와 함께 말차 라떼와 에이드가 맛있습니다 :)",
          tags: "#신구초교 공영주차장 이용 #4인 가능"
      },
    ]
  }
  