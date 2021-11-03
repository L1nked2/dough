from selenium import webdriver
from selenium.common.exceptions import *
from selenium.webdriver.common.keys import Keys


# '맛집 리스트' URL 수집시 자원 활용
class Toplist:
    def __init__(self):
        initpage()

    # 더보기 버튼 클릭
    def more(self):
        while (1):
            try:
                driver.find_element_by_xpath("//a[@class='btn-more']").click()
            except ElementNotVisibleException:
                break
            except WebDriverException:
                break


# 해쉬태그 URL 속 URL 수집시 자원 활용
class PageURL:
    def __init__(self, url):
        connect(url)

    # 더보기 버튼 클릭
    def more(self):
        while (1):
            try:
                driver.find_element_by_xpath("//button[@class='more_btn']").click()
            except ElementNotVisibleException:
                break
            except WebDriverException:
                break
            except AttributeError:
                break


from bs4 import BeautifulSoup
from urllib.parse import urljoin
from time import sleep

# 맛집 이름 리스트 생성
R_name_list = []
def hConnect(url):
    driver.get('https://www.mangoplate.com' + url)

class Parsing :


    #지하철역 주변 맛집 URL 수집
    def getHotLink(self):
        html_doc = driver.page_source
        soup = BeautifulSoup(html_doc, 'html.parser')
        hotlink = []
        for link in soup.find_all('a'):
            try:
                if link.get('href').find('restaurants') != -1 :
                    if link.get('href').find('restaurant_key') == -1 :
                        hotlink.append(link.get('href'))
            except AttributeError:
                continue
        return list(set(hotlink))

    #수집한 맛집 정보 파싱, 전처리
    def parsingHot(self, url):
        hConnect(url)
        driver.implicitly_wait(3)
        html_doc = driver.page_source
        soup = BeautifulSoup(html_doc, 'html.parser')
        #맛집 이름
        title = soup.find("h1",{"class": "restaurant_name"})
        #맛집 평점
        #rating = soup.find("strong",{"class": "rate-point"})//별점 없으면 parsing error 발생
        #맛집 정보
        info = dict()
        info['이름'] = title.get_text()
        #맛집 이름 추가
        R_name_list.append(title.get_text())
        print(R_name_list)
        with open('listing.txt', 'w', encoding='UTF8') as f:
            for name in R_name_list:
                f.write(name+'\n')

        #info['평점'] = rating.get_text().replace('\n', '')//별점 없으면 parsing error 발생
        table = soup.find("tbody")
        for thtd in table.find_all("tr"):
            if thtd.th.get_text() != "메뉴":
                temp = thtd.th.get_text().replace(' ', '')
                info[temp.replace('\n', '')] = thtd.td.get_text().replace('\n', '')
            else:
                info[thtd.th.get_text()] = thtd.td.get_text()
        return info
        #except AttributeError:
        #    print("없음")


#웹페이지 불러오기
def initpage():
    driver.get(url)

# 레스토랑 서칭
def hConnect(url):
    driver.get('https://www.mangoplate.com/' + url)

# 해쉬태그 서칭
def connect(n):
    driver.get(f'https://www.mangoplate.com/search/{place}?keyword=&page=' + str(n))


