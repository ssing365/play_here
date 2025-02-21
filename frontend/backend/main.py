from fastapi import FastAPI, HTTPException
from db_connect import get_data
import pandas as pd
import numpy as np
from scipy.sparse.linalg import svds
from scipy.sparse import csr_matrix  # 🔹 희소행렬 변환 추가
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()

def extract_region(address):
    if pd.isna(address) or not isinstance(address, str):
        return None
    parts = address.split()
    if len(parts) >= 1:  # '서울특별시 강남구' → '서울특별시' 기준으로 필터링
        return parts[0]  
    return address


@app.get("/api/recommend/{user_id}")
def recommend_places(user_id: str):
    try:
        if user_id == "guest":
            print("🟡 비로그인 상태 → 랜덤 추천 반환")
            
            random_places_query = """
                SELECT P.PLACE_ID, P.PLACE_NAME, P.IMAGE, P.LOCATION, PP.PREFERENCE_ID
                FROM PLACE P
                LEFT JOIN PLACE_PREFERENCE PP ON P.PLACE_ID = PP.PLACE_ID
                ORDER BY DBMS_RANDOM.VALUE FETCH FIRST 50 ROWS ONLY
            """
            random_places = get_data(random_places_query)

            print(f"🟢 랜덤 추천 장소 개수: {len(random_places)}")
            print("🟢 랜덤 추천 데이터 확인:", random_places)  # ✅ 디버깅 로그 추가

            return random_places.to_dict(orient="records")

        
        # 1️⃣ 사용자 주소 가져오기
        # 1️⃣ 사용자 주소 가져오기 (안전 처리 추가)
        address_query = """
            SELECT ADDRESS
            FROM MEMBER
            WHERE USER_ID = :user_id
        """
        user_address_df = get_data(address_query, {"user_id": user_id})

        # 🔍 데이터가 존재하는지 확인
        if user_address_df.empty:
            raise HTTPException(status_code=404, detail="사용자의 주소 정보를 찾을 수 없습니다.")

        # 🔍 컬럼명 체크 및 NULL 값 처리
        user_address_df.columns = user_address_df.columns.str.upper()  # 컬럼명을 대문자로 변환
        if "ADDRESS" in user_address_df.columns:
            user_address = str(user_address_df.iloc[0]["ADDRESS"]) if pd.notna(user_address_df.iloc[0]["ADDRESS"]) else ""
        else:
            raise HTTPException(status_code=500, detail="MEMBER 테이블에 'ADDRESS' 컬럼이 없습니다.")

        # 🔹 사용자 주소에서 '시, 구' 또는 '구, 동' 단위로 지역 추출
        user_region = extract_region(user_address)
        if not user_region:
            raise HTTPException(status_code=500, detail="사용자 주소에서 지역 정보를 추출할 수 없습니다.")

        # 2️⃣ 사용자 선호도 가져오기
        pref_query = """
            SELECT UP.USER_ID, P.MAIN_CATE, P.SUB_CATE
            FROM USER_PREFERENCE UP
            JOIN PREFERENCE P ON UP.PREFERENCE_ID = P.PREFERENCE_ID
            WHERE UP.USER_ID = :user_id
        """
        user_preferences = get_data(pref_query, {"user_id": user_id})

        # 3️⃣ 사용자 관심 장소 가져오기 (모든 사용자 데이터)
        interest_query = """
            SELECT USER_ID, PLACE_ID
            FROM INTERESTS
        """
        user_interests = get_data(interest_query)  # 모든 사용자 관심 장소 가져오기

        # 4️⃣ 모든 장소 정보 가져오기
        places_query = """
            SELECT P.PLACE_ID, P.PLACE_NAME, P.IMAGE, P.LOCATION, PP.PREFERENCE_ID, PR.MAIN_CATE, PR.SUB_CATE
            FROM PLACE P
            LEFT JOIN PLACE_PREFERENCE PP ON P.PLACE_ID = PP.PLACE_ID
            LEFT JOIN PREFERENCE PR ON PP.PREFERENCE_ID = PR.PREFERENCE_ID
        """
        places = get_data(places_query)

        # 🔍 1. 컬럼명 변환 및 NULL 값 처리
        places.columns = places.columns.str.upper()
        user_preferences.columns = user_preferences.columns.str.upper()
        user_interests.columns = user_interests.columns.str.upper()

        places.fillna("", inplace=True)
        user_preferences.fillna("", inplace=True)
        user_interests.fillna("", inplace=True)
       
        places["IMAGE"] = places["IMAGE"].astype(str)
        places["LOCATION"] = places["LOCATION"].astype(str)  # 🔹 LOCATION 컬럼도 문자열 변환

        # 🔍 장소 데이터에서 지역 필터링 (사용자 지역과 일치하는 장소만 선택)
        places["REGION"] = places["LOCATION"].apply(extract_region)
        places = places[places["REGION"] == user_region]

        if places.empty:
            return {"message": f"'{user_region}' 지역 내 추천할 장소가 없습니다."}

        # 🔹 TF-IDF 벡터화 (콘텐츠 기반 필터링)
        vectorizer = TfidfVectorizer()
        place_features = places["MAIN_CATE"].astype(str) + " " + places["SUB_CATE"].astype(str)
        place_matrix = vectorizer.fit_transform(place_features)

        user_features = " ".join(user_preferences["MAIN_CATE"].astype(str) + " " + user_preferences["SUB_CATE"].astype(str))
        user_vector = vectorizer.transform([user_features])

        similarity_scores = cosine_similarity(user_vector, place_matrix)
        content_recommendations = places.iloc[similarity_scores.argsort()[0][-30:][::-1]]  # 콘텐츠 기반 추천 20개

        # 🔹 user_place_matrix 생성 (SVD 적용 가능하도록)
        user_place_matrix = user_interests.pivot(index="USER_ID", columns="PLACE_ID", values="PLACE_ID")
        user_place_matrix = user_place_matrix.notnull().astype(float)  # NaN을 0으로 변환

        # ✅ SVD 수행
        svd_recommendations = pd.DataFrame()
        if user_place_matrix.shape[0] > 1:
            user_place_sparse = csr_matrix(user_place_matrix.values)
            U, sigma, Vt = svds(user_place_sparse, k=min(10, user_place_matrix.shape[0]-1))
            sigma = np.diag(sigma)

            user_predicted_ratings = np.dot(np.dot(U, sigma), Vt)
            user_predicted_df = pd.DataFrame(user_predicted_ratings, index=user_place_matrix.index, columns=user_place_matrix.columns)

            if user_id in user_predicted_df.index:
                svd_recommendations = user_predicted_df.loc[user_id].sort_values(ascending=False).index[:40]
                svd_recommendations = places[places["PLACE_ID"].isin(svd_recommendations)]

        # 🔹 SVD 추천이 없으면 콘텐츠 추천을 사용
        if svd_recommendations.empty:
            recommended_places = content_recommendations.head(30)
        else:
            recommended_places = pd.concat([svd_recommendations, content_recommendations]).drop_duplicates(subset=["PLACE_ID"]).head(100)

        

        return recommended_places.to_dict(orient="records")

    except Exception as e:
        print("❌ 오류 발생 (추천 시스템):", e)
        raise HTTPException(status_code=500, detail=str(e))

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:8080"],  # React & Spring Boot 허용
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메서드 허용
    allow_headers=["*"],  # 모든 헤더 허용
)
