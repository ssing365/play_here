import os
import time
import json
import requests
import pandas as pd  # ✅ CSV 저장을 위해 추가
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import NoSuchElementException
from bs4 import BeautifulSoup
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains

# ✅ Chrome 실행 옵션 추가
options = webdriver.ChromeOptions()
options.add_argument("headless")  # 브라우저 창 없이 실행
options.add_argument("lang=ko_KR")

# ✅ ChromeDriver 실행 (Selenium 4.x 버전 사용)
service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service, options=options)

# ✅ 카카오 API 키 설정
KAKAO_API_KEY = "318622c7a0475756a1bb323c9a4a17cd"

def get_lat_lng_from_kakao(place_name):
    """ 카카오 API를 사용하여 장소명으로 위도(latitude) / 경도(longitude) 가져오는 함수 """
    url = "https://dapi.kakao.com/v2/local/search/keyword.json"
    headers = {"Authorization": f"KakaoAK {KAKAO_API_KEY}"}
    params = {"query": place_name}

    try:
        response = requests.get(url, headers=headers, params=params)
        data = response.json()
        longitude = float(data["documents"][0]["x"])  # 경도
        latitude = float(data["documents"][0]["y"])  # 위도
        return longitude, latitude
    except (requests.exceptions.RequestException, KeyError, IndexError):
        return None, None

def save_to_csv(results, search_keyword):
    """ 크롤링한 데이터를 CSV 파일로 저장하는 함수 """
    if not results:
        return
    filename = f"{search_keyword}_data.csv".replace(" ", "_")  # 공백을 _ 로 변환
    df = pd.DataFrame(results)
    df.to_csv(filename, index=False, encoding="utf-8-sig")

def main():
    global driver
    driver.implicitly_wait(4)
    driver.get("https://map.kakao.com/")

    results = []
    
    # ✅ 여러 키워드를 쉼표(,)로 입력받음
    search_keywords = input("🔍 검색할 키워드 입력 (쉼표로 구분, 예: 서울 맛집, 경기 맛집): ").strip()
    if not search_keywords:
        return

    max_places = int(input("📌 크롤링할 장소 개수를 입력하세요: ").strip())
    if max_places <= 0:
        print("❌ 잘못된 입력입니다. 최소 1개 이상의 장소를 입력해야 합니다.")
        return

    # ✅ 입력된 키워드를 리스트로 변환 후 각각 개별적으로 검색
    search_keywords_list = [kw.strip() for kw in search_keywords.split(",") if kw.strip()]
    
    for search_keyword in search_keywords_list:
        print(f"\n🔍 '{search_keyword}' 검색 시작!")

        # ✅ 검색창 초기화 (이전 검색어 삭제 후 입력)
        search_area = driver.find_element(By.XPATH, '//*[@id="search.keyword.query"]')
        search_area.clear()  # 기존 검색어 삭제
        time.sleep(1)  # 검색창이 완전히 초기화되도록 약간의 시간 추가
        search(search_keyword, results, max_places)
    
    driver.quit()
    # ✅ 모든 결과를 한 개의 CSV 파일에 저장
    save_to_csv(results, "all_places")



def search(search_keyword, results, max_places):
    global driver
    
    search_area = driver.find_element(By.XPATH, '//*[@id="search.keyword.query"]')
    search_area.send_keys(search_keyword)
    driver.find_element(By.XPATH, '//*[@id="search.keyword.submit"]').send_keys(Keys.ENTER)
    time.sleep(2)

    count = 0  # ✅ 크롤링한 장소 개수
    page_no = 1  # ✅ 현재 페이지 번호 (1페이지부터 시작)

    print(f"🔹 현재 페이지({page_no}번)에서 크롤링 시작")
    count = crawl_current_page(results, max_places, count)
    if count >= max_places:
        return

    # ✅ "장소 더보기" 버튼 클릭 (처음 한 번만 실행)
    try:
        more_button = driver.find_element(By.XPATH, '//*[@id="info.search.place.more"]')
        if more_button.is_displayed():
            driver.execute_script("arguments[0].click();", more_button)
            print("✅ 장소 더보기 버튼 클릭 완료")
            time.sleep(2)
    except NoSuchElementException:
        print("⚠️ 장소 더보기 버튼 없음")
    
    # ✅ 2~5 페이지 크롤링
    for page_no in range(2, 6):  # 2번 ~ 5번 페이지 반복
        print(f"✅ {page_no} 페이지로 이동")
        page_button = driver.find_element(By.XPATH, f'//*[@id="info.search.page.no{page_no}"]')
        driver.execute_script("arguments[0].click();", page_button)
        time.sleep(2)
        count = crawl_current_page(results, max_places, count)
        if count >= max_places:
            return

    # ✅ 이후 "다음 페이지" 버튼을 눌러 다시 1번 페이지로 이동
    while count < max_places:
        try:
            next_button = driver.find_element(By.XPATH, '//*[@id="info.search.page.next"]')
            if next_button.is_displayed():
                driver.execute_script("arguments[0].click();", next_button)
                print("✅ 다음 페이지로 이동")
                time.sleep(2)
        except NoSuchElementException:
            print("⚠️ 다음 페이지 버튼 없음")
            return

        # ✅ 1번 페이지 크롤링
        print(f"🔹 현재 페이지(1번)에서 크롤링 시작")
        count = crawl_current_page(results, max_places, count)
        if count >= max_places:
            return

        # ✅ 2~5 페이지 크롤링 반복
        for page_no in range(2, 6):  
            print(f"✅ {page_no} 페이지로 이동")
            try:
                page_button = driver.find_element(By.XPATH, f'//*[@id="info.search.page.no{page_no}"]')
                driver.execute_script("arguments[0].click();", page_button)
                time.sleep(2)
                count = crawl_current_page(results, max_places, count)
                if count >= max_places:
                    return
            except NoSuchElementException:
                print(f"⚠️ {page_no} 페이지 버튼 없음")
                return

def crawl_current_page(results, max_places, count):
    place_list = driver.find_elements(By.XPATH, '//*[@id="info.search.place.list"]/li')
    print(f"🔹 현재 페이지에서 {len(place_list)}개 장소 발견")

    for i in range(len(place_list)):
        if count >= max_places:
            return count
        try:
            place_xpath = f'//*[@id="info.search.place.list"]/li[{i+1}]/div[5]/div[4]/a[1]'
            place_element = driver.find_element(By.XPATH, place_xpath)
            place_element.send_keys(Keys.ENTER)
            driver.switch_to.window(driver.window_handles[-1])
            time.sleep(2)

            # ✅ 검색 키워드 없이 장소 데이터만 추가
            results.append(scrape_details())

            driver.close()
            driver.switch_to.window(driver.window_handles[0])
            count += 1
        except NoSuchElementException:
            break
    return count




def scrape_details():
    """ 상세정보 크롤링 함수 """
    global driver
    html = driver.page_source
    soup = BeautifulSoup(html, "html.parser")

    try:
        place_name = soup.select_one(".inner_place .tit_location").text.strip()
    except AttributeError:
        place_name = None
    try:
        location = (
            soup.select_one(".location_detail .txt_address")
            .get_text(separator=" ")  # ✅ 줄바꿈을 공백으로 변환
            .replace("\n                ", " ")  # ✅ 혹시 남아있는 줄바꿈 제거
            .strip()  # ✅ 양쪽 공백 제거
        )
    except AttributeError:
        location = None

    try:
        descript = soup.select_one(".location_detail .txt_introduce").text.strip()
    except AttributeError:
        descript = None

    try:
        time_info = soup.select_one(".location_detail.openhour_wrap .txt_operation").text.strip()
        time_info = time_info.replace("\n", " ")  # ✅ 개행 문자를 공백으로 변환
    except AttributeError:
        time_info = None


    try:
        parking = "가능" if "ico_parking" in soup.select_one(".list_facility span.ico_comm").get("class") else "불가능"
    except AttributeError:
        parking = "정보 없음"

    try:
        hashtag = soup.select_one(".location_detail .tag_g").text.replace("\n", ", ").strip(", ")
    except AttributeError:
        hashtag = None

    try:
        call = soup.select_one(".location_detail .txt_contact").text.strip()
    except AttributeError:
        call = None

    try:
        link = driver.current_url
    except AttributeError:
        link = None

    try:
        image = soup.select_one(".bg_present").get("style").split("url(")[-1].split(")")[0].strip("'")
        if image.startswith("//"):  # ✅ 프로토콜 없는 경우
            image = "https:" + image  # ✅ https 추가
    except AttributeError:
        image = "https://via.placeholder.com/300x200?text=No+Place+Image"


    # ✅ 지도 관련 정보 (경도, 위도)
    longitude, latitude = get_lat_lng_from_kakao(place_name)

    try:
        placename_onmap = soup.select_one(".inner_place .tit_location").text.strip()
    except AttributeError:
        placename_onmap = None

    # ✅ 날짜 정보 (현재 날짜 기준)
    from datetime import datetime
    regist_date = datetime.today().strftime("%Y-%m-%d")
    edit_date = datetime.today().strftime("%Y-%m-%d")

    # ✅ 결과 데이터 저장
    place_data = {
        "pace_id": "PLACE_SEQ.NEXTVAL",
        "place_name": place_name,
        "location": location,
        "descript": descript,
        "time": time_info,
        "parking": parking,
        "call": call,
        "link": link,
        "image": image,
        "longitude": longitude,
        "latitude": latitude,
        "placename_onmap": placename_onmap,
        "regist_date": regist_date,
        "edit_date": edit_date,
        "likes" : 0,
        "hashtag": hashtag,
    }

    return place_data

if __name__ == "__main__":
    main()