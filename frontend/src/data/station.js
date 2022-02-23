const stationDictionary = {
    "1호선": {
        "ㄱ": ['가능', '가산디지털단지', '간석', '개봉', '관악', '광명', '광운대', '구로', '구일', '군포', '금정', '금천구청'],
        "ㄴ": ['남영', '노량진', '녹양', '녹천'],
        "ㄷ": ['당정', '대방', '덕계', '덕정', '도봉', '도봉산', '도원', '도화', '독산', '동대문', '동두천', '동두천중앙', '동묘앞', '동암', '동인천', '두정'],
        "ㄹ": [],
        "ㅁ": ['망월사', '명학'],
        "ㅂ": ['방학', '배방', '백운', '병점', '보산', '봉명', '부개', '부천', '부평'],
        "ㅅ": ['서동탄', '서울역', '서정리', '석계', '석수', '성균관대', '성환', '세류', '세마', '소사', '소요산', '송내', '송탄', '수원', '시청', '신길', '신도림', '신설동', '신이문', '신창', '쌍용'],
        "ㅇ": ['아산', '안양', '양주', '역곡', '영등포', '오류동', '오산', '오산대', '온수', '온양온천', '외대앞', '용산', '월계', '의왕', '의정부', '인천'],
        "ㅈ": ['제기동', '제물포', '종각', '종로3가', '종로5가', '주안', '중동', '지행', '직산', '진위'],
        "ㅊ": ['창동', '천안', '청량리'],
        "ㅋ": [],
        "ㅌ": [],
        "ㅍ": ['평택', '평택지제', '화서', '회기', '회룡'],
        "ㅎ": []
    },
    "2호선": {
        "ㄱ": ['강남', '강변' , '건대입구' , '교대' , '구로디지털단지' , '구의' , '까치산' ],
        "ㄴ": ['낙성대'],
        "ㄷ": ['당산', '대림', '도림천', '동대문역사문화공원', '뚝섬'],
        "ㄹ": [],
        "ㅁ": ['문래'],
        "ㅂ": ['방배', '봉천'],
        "ㅅ": ['사당', '삼성', '상왕십리', '서울대입구', '서초', '선릉', '성수', '시청', '신답', '신당', '신대방', '신도림', '신림', '신설동', '신정네거리', '신촌'],
        "ㅇ": ['아현', '양천구청', '역삼', '영등포구청', '왕십리', '용답', '용두', '을지로3가', '을지로4가', '을지로입구', '이대'],
        "ㅈ": ['잠실', '잠실나루', '잠실새내', '종합운동장'],
        "ㅊ": ['충정로'],
        "ㅋ": [],
        "ㅌ": [],
        "ㅍ": [],
        "ㅎ": ['한양대', '합정', '홍대입구']
    },
    "3호선": {
        "ㄱ": ['가락시장', '경복궁', '경찰병원', '고속터미널', '교대', '구파발', '금호'],
        "ㄴ": ['남부터미널', '녹번'],
        "ㄷ": ['대곡', '대청', '대치', '대화', '도곡', '독립문', '동대입구'],
        "ㄹ": [],
        "ㅁ": ['마두', '매봉', '무악재'],
        "ㅂ": ['백석', '불광'],
        "ㅅ": ['삼송', '수서', '신사'],
        "ㅇ": ['안국', '압구정', '약수', '양재', '연신내', '오금', '옥수', '원당', '원흥', '을지로3가', '일원'],
        "ㅈ": ['잠원', '정발산', '종로3가', '주엽', '지축'],
        "ㅊ": ['충무로'],
        "ㅋ": [],
        "ㅌ": [],
        "ㅍ": [],
        "ㅎ": ['학여울', '홍제', '화정'],
    },
    "4호선": {
        "ㄱ": ['경마공원', '고잔', '과천', '금정', '길음'],
        "ㄴ": ['남태령', '노원'],
        "ㄷ": ['당고개', '대공원', '대야미', '동대문', '동대문역사문화공원', '동작'],
        "ㄹ": [],
        "ㅁ": ['명동', '미아', '미아사거리'],
        "ㅂ": ['반월', '범계'],
        "ㅅ": ['사당', '산본', '삼각지', '상계', '상록수', '서울역', '선바위', '성신여대입구', '수리산', '수유', '숙대입구', '신길온천', '신용산', '쌍문'],
        "ㅇ": ['안산', '오이도', '이촌', '인덕원'],
        "ㅈ": ['정부과천청사', '정왕', '중앙'],
        "ㅊ": ['창동', '초지', '총신대입구', '충무로'],
        "ㅋ": [],
        "ㅌ": [],
        "ㅍ": ['평촌'],
        "ㅎ": ['한대앞', '한성대입구', '혜화', '회현']
    },
    "5호선": {
        "ㄱ": ['강동', '강일', '개롱', '개화산', '거여', '고덕', '공덕', '광나루', '광화문', '군자', '굽은다리', '길동', '김포공항', '까치산'],
        "ㄴ": [],
        "ㄷ": ['답십리', '동대문역사문화공원', '둔촌동'],
        "ㄹ": [],
        "ㅁ": ['마곡', '마장', '마천', '마포', '명일', '목동', '미사'],
        "ㅂ": ['발산', '방이', '방화'],
        "ㅅ": ['상일동', '서대문', '송정', '신금호', '신길', '신정'],
        "ㅇ": ['아차산', '애오개', '양평', '여의나루', '여의도', '영등포구청', '영등포시장', '오금', '오목교', '올림픽공원', '왕십리', '우장산', '을지로4가'],
        "ㅈ": ['장한평', '종로3가'],
        "ㅊ": ['천호', '청구', '충정로'],
        "ㅋ": [],
        "ㅌ": [],
        "ㅍ": [],
        "ㅎ": ['하남검단산', '하남시청', '하남풍산', '행당', '화곡']
    },
    "6호선": {
        "ㄱ": ['고려대', '공덕', '광흥창', '구산'],
        "ㄴ": ['녹사평'],
        "ㄷ": ['대흥', '독바위', '돌곶이', '동며앞', '디지털미디어시티'],
        "ㄹ": [],
        "ㅁ": ['마포구청', '망원'],
        "ㅂ": ['버티고개', '보문', '봉화산', '불광'],
        "ㅅ": ['삼각지', '상수', '상월곡', '새절', '석계', '신내', '신당'],
        "ㅇ": ['안암', '약수', '역촌', '연신내', '월곡', '월드컵경기장', '응암', '이태원'],
        "ㅈ": ['증산'],
        "ㅊ": ['창신', '청구'],
        "ㅋ": [],
        "ㅌ": ['태릉입구'],
        "ㅍ": [],
        "ㅎ": ['한강진', '합정', '화랑대', '효창공원앞']
    },
    "7호선": {
        "ㄱ": ['가산디지털단지', '강남구청', '건대입구', '고속터미널','공릉', '광명사거리', '군자', '굴포천', '까치울'],
        "ㄴ": ['남구로', '남성', '내방', '노원', '논현'],
        "ㄷ": ['대림', '도봉산', '뚝섬유원지'],
        "ㄹ": [],
        "ㅁ": ['마들', '먹골', '면목'],
        "ㅂ": ['반포', '보라매', '부천시청', '부천종합운동장', '부평구청'],
        "ㅅ": ['사가정', '산곡', '삼산체육관', '상도', '상동', '상봉', '석남', '수락산', '숭실대입구', '신대방삼거리', '신중동', '신풍'],
        "ㅇ": ['어린이대공원', '온수', '용마산', '이수'],
        "ㅈ": ['장승배기', '장암', '중계', '중곡', '중화'],
        "ㅊ": ['천왕', '철산', '청담', '춘의'],
        "ㅋ": [],
        "ㅌ": ['태릉입구'],
        "ㅍ": [],
        "ㅎ": ['하계', '학동']
    },
    "8호선": {
        "ㄱ": ['가락시장', '강동구청'],
        "ㄴ": ['남한산성입구'],
        "ㄷ": ['단대오거리'],
        "ㄹ": [],
        "ㅁ": ['모란', '몽촌토성', '문정'],
        "ㅂ": ['복정'],
        "ㅅ": ['산성', '석촌', '송파', '수진', '신흥'],
        "ㅇ": ['암사'],
        "ㅈ": ['잠실', '장지'],
        "ㅊ": ['천호'],
        "ㅋ": [],
        "ㅌ": [],
        "ㅍ": [],
        "ㅎ": []
    },
    "9호선": {
        "ㄱ": ['가양', '개화', '고속터미널', '공항시장', '구반포', '국회의사당', '김포공항'],
        "ㄴ": ['노들', '노량진'],
        "ㄷ": ['당산', '동작', '둔촌오륜', '등촌'],
        "ㄹ": [],
        "ㅁ": ['마곡나루'],
        "ㅂ": ['봉은사'],
        "ㅅ": ['사평', '삼성중앙', '삼전', '샛강', '석촌', '석촌고분', '선유도', '선정릉', '송파나루', '신논현', '신목동', '신반포', '신방화'],
        "ㅇ": ['양천향교', '언주', '여의도', '염창', '올림픽공원'],
        "ㅈ": ['종합운동장', '중앙보훈병원', '증미'],
        "ㅊ": [],
        "ㅋ": [],
        "ㅌ": [],
        "ㅍ": [],
        "ㅎ": ['한성백제', '흑석']
    },
    "경강선": {
        "ㄱ": ['경기광주', '곤지암'],
        "ㄴ": [],
        "ㄷ": [],
        "ㄹ": [],
        "ㅁ": [],
        "ㅂ": ['부발'],
        "ㅅ": ['삼동', '세종대왕릉', '신둔도예촌'],
        "ㅇ": ['여주', '이매', '이천'],
        "ㅈ": [],
        "ㅊ": ['초월'],
        "ㅋ": [],
        "ㅌ": [],
        "ㅍ": ['판교'],
        "ㅎ": []
    },    
    "경의중앙선": {
        "ㄱ": ['가좌', '강매', '곡산', '공덕', '구리', '국수', '금릉', '금촌'],
        "ㄴ": ['능곡'],
        "ㄷ": ['대곡', '덕소', '도농', '도심', '디지털미디어시티'],
        "ㄹ": [],
        "ㅁ": ['망우', '문산'],
        "ㅂ": ['백마'],
        "ㅅ": ['상봉', '서강대', '서빙고', '서울역', '수색', '신원', '신촌'],
        "ㅇ": ['아신', '야당', '양수', '양원', '양정', '양평', '오빈', '옥수', '왕십리', '용문', '용산', '운길산', '운정', '원덕', '월롱', '응봉', '이촌', '일산', '임진강'],
        "ㅈ": ['중랑', '지평'],
        "ㅊ": ['청량리'],
        "ㅋ": [],
        "ㅌ": ['탄현'],
        "ㅍ": ['파주', '팔당', '풍산'],
        "ㅎ": ['한남', '행신', '홍대입구', '화전', '회기', '효창공원앞']
    },    
    "경춘선": {
        "ㄱ": ['가평', '갈매', '강촌', '광운대', '굴봉산', '금곡', '김유정'],
        "ㄴ": ['남춘천'],
        "ㄷ": ['대성리'],
        "ㄹ": [],
        "ㅁ": ['마석', '망우'],
        "ㅂ": ['백양리', '별내'],
        "ㅅ": ['사릉', '상봉', '상천', '신내'],
        "ㅇ": [],
        "ㅈ": ['중랑'],
        "ㅊ": ['천마산', '청량리', '청평', '춘천'],
        "ㅋ": [],
        "ㅌ": ['퇴계원'],
        "ㅍ": ['평내호평'],
        "ㅎ": ['회기']
    },    
    "공항철도": {
        "ㄱ": ['검암', '계양', '공덕', '공항화물청사', '김포공항'],
        "ㄴ": [],
        "ㄷ": ['디지털미디어시티'],
        "ㄹ": [],
        "ㅁ": ['마곡나루'],
        "ㅂ": [],
        "ㅅ": ['서울역'],
        "ㅇ": ['영종', '운서', '인천공항1터미널', '인청공항2터미널'],
        "ㅈ": [],
        "ㅊ": ['청라국제도시'],
        "ㅋ": [],
        "ㅌ": [],
        "ㅍ": [],
        "ㅎ": ['홍대입구']
    },    
    "김포골드": {
        "ㄱ": ['걸포북변', '고촌', '구래', '김포공항'],
        "ㄴ": [],
        "ㄷ": [],
        "ㄹ": [],
        "ㅁ": ['마산'],
        "ㅂ": [],
        "ㅅ": ['사우'],
        "ㅇ": ['양촌', '운양'],
        "ㅈ": ['장기'],
        "ㅊ": [],
        "ㅋ": [],
        "ㅌ": [],
        "ㅍ": ['풍무'],
        "ㅎ": []
    },    
    "서해선": {
        "ㄱ": [],
        "ㄴ": [],
        "ㄷ": ['달미'],
        "ㄹ": [],
        "ㅁ": [],
        "ㅂ": [],
        "ㅅ": ['선부', '소사', '소새울', '시우', '시흥능곡', '시흥대야', '시흥시청', '신천', '신현'],
        "ㅇ": ['원시'],
        "ㅈ": [],
        "ㅊ": ['초지'],
        "ㅋ": [],
        "ㅌ": [],
        "ㅍ": [],
        "ㅎ": []
    },    
    "수인분당선": {
        "ㄱ": ['가천대', '강남구청', '개포동', '고색', '고잔', '구룡', '구성', '기흥'],
        "ㄴ": ['남동인더스파크'],
        "ㄷ": ['달월', '대모산입구', '도곡'],
        "ㄹ": [],
        "ㅁ": ['망포', '매교', '매탄권선', '모란', '미금'],
        "ㅂ": ['보정', '복정'],
        "ㅅ": ['사리', '상갈', '서울숲', '서현', '선릉', '선정릉', '소래포구', '송도', '수내', '수서', '수원', '수원시청', '숭의', '신갈', '신길온천', '신포'],
        "ㅇ": ['안산', '압구정로데오', '야목', '야탑', '어천', '연수', '영통', '오리', '오목천', '오이도', '왕십리', '원인재', '월곶', '이매', '인천', '인천논현', '인하대'],
        "ㅈ": ['정왕', '정자', '죽전', '중앙'],
        "ㅊ": ['청량리', '청명', '초지'],
        "ㅋ": [],
        "ㅌ": ['태평'],
        "ㅍ": [],
        "ㅎ": ['한대앞', '한티', '호구포']
    },
    "신분당선": {
        "ㄱ": ['강남', '광교', '광교중앙'],
        "ㄴ": [],
        "ㄷ": ['동천'],
        "ㄹ": [],
        "ㅁ": ['미금'],
        "ㅂ": [],
        "ㅅ": ['상현', '성복', '수지구청'],
        "ㅇ": ['양재', '양재시민의숲'],
        "ㅈ": ['정자'],
        "ㅊ": ['청계산입구'],
        "ㅋ": [],
        "ㅌ": [],
        "ㅍ": ['판교'],
        "ㅎ": []
    },
    "에버라인": {
        "ㄱ": ['강남대', '고진', '기흥', '김량장'],
        "ㄴ": [],
        "ㄷ": ['동백', '둔전'],
        "ㄹ": [],
        "ㅁ": ['명지대'],
        "ㅂ": ['보평'],
        "ㅅ": ['삼가', '시청.용인대'],
        "ㅇ": ['어정', '운동장.송담대'],
        "ㅈ": ['전대.에버랜드', '지석'],
        "ㅊ": ['초당'],
        "ㅋ": [],
        "ㅌ": [],
        "ㅍ": [],
        "ㅎ": []
    },
    "우의신설선": {
        "ㄱ": ['4.19민주묘지', '가오리'],
        "ㄴ": [],
        "ㄷ": [],
        "ㄹ": [],
        "ㅁ": [],
        "ㅂ": ['보문', '북한산보국문', '북한산우이'],
        "ㅅ": ['삼양', '삼양사거리', '성신여대입구', '솔밭공원', '솔샘', '신설동'],
        "ㅇ": [],
        "ㅈ": ['정릉'],
        "ㅊ": [],
        "ㅋ": [],
        "ㅌ": [],
        "ㅍ": [],
        "ㅎ": ['화계']
    },
    "의정부선": {
        "ㄱ": ['경기도청북부청사', '경전철의정부', '곤제'],
        "ㄴ": [],
        "ㄷ": ['동오'],
        "ㄹ": [],
        "ㅁ": [],
        "ㅂ": ['발곡', '범골'],
        "ㅅ": ['새말', '송산'],
        "ㅇ": ['어룡', '의정부시청', '의정부중앙'],
        "ㅈ": [],
        "ㅊ": [],
        "ㅋ": [],
        "ㅌ": ['탑석'],
        "ㅍ": [],
        "ㅎ": ['회룡', '효자', '흥선']
    },
    "인천1호선": {
        "ㄱ": ['간석오거리', '갈산', '경인교대입구', '계산', '계양', '국제업무지구', '귤현'],
        "ㄴ": [],
        "ㄷ": ['동막', '동수', '동춘'],
        "ㄹ": [],
        "ㅁ": ['문학경기장'],
        "ㅂ": ['박촌', '부평', '부평구청', '부평삼거리', '부평시장'],
        "ㅅ": ['선학', '센트럴파크', '송도달빛축제공원', '신연수'],
        "ㅇ": ['예술회관', '원인재', '인천대입구', '인천시청', '인천터미널', '임학'],
        "ㅈ": ['작전', '지식정보단지'],
        "ㅊ": [],
        "ㅋ": ['캠퍼스타운', '테크노파크'],
        "ㅌ": [],
        "ㅍ": [],
        "ㅎ": []
    },
    "인천2호선": {
        "ㄱ": ['가재울', '가정', '가정중앙시장', '검단사거리', '검단오류', '검바위', '검암'],
        "ㄴ": ['남동구청'],
        "ㄷ": ['독정'],
        "ㄹ": [],
        "ㅁ": ['마전', '만수', '모래내시장'],
        "ㅂ": [],
        "ㅅ": ['서구청', '서부여성회관', '석남', '석바위시장', '석천사거리', '시민공원'],
        "ㅇ": ['아시아드경기장', '완정', '왕길', '운연', '인천가좌', '인천대공원', '인천시청'],
        "ㅈ": ['주안', '주안국가산단'],
        "ㅊ": [],
        "ㅋ": [],
        "ㅌ": [],
        "ㅍ": [],
        "ㅎ": []
    }
}

export default stationDictionary;