from dough_crawler import *
from firestore_lib import *


# 장소 받기
print("핫 플레이스 검색: ")
place = input()
url = 'https://www.mangoplate.com/search/' + place

# ChromeDriver로 접속, 자원 로딩시간 3초
try:
    options = webdriver.ChromeOptions()
    options.add_experimental_option("excludeSwitches", ["enable-logging"])
    driver = webdriver.Chrome('./chromedriver.exe', options=options)
    driver.implicitly_wait(3)
    driver.refresh()
except:
    print("크롬드라이버 연결 에러")

p = Parsing()
page = 1
PageInURL = dict()
# 카테고리 별 URL 속 맛집 URL 수집
while (page < 11):
    hotlinklist = []
    connectPageURL = PageURL(page)
    hotlinklist.append(p.getHotLink())
    PageInURL[page] = hotlinklist
    page += 1

# 맛집 정보 파싱
for page in PageInURL.keys():
    for urllist in PageInURL[page]:
        for url in urllist:
            try:
                info = p.parsingHot(url)
                info['pageN'] = page
                insertDB(info)
            except:
                print("Parsing Error")
                continue