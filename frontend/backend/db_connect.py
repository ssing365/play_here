import oracledb
from sqlalchemy import create_engine
import pandas as pd

# Oracle DB 연결 정보 설정
DB_USER = "admin"
DB_PASSWORD = "playhere1234"
DB_HOST = "203.234.214.118"
DB_PORT = "1521"
DB_SID = "xe"

# Oracle 연결 URL 생성 (SQLAlchemy + oracledb)
db_url = f"oracle+oracledb://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/?service_name={DB_SID}"
engine = create_engine(db_url, echo=True)

# ✅ DataFrame 반환 함수 (params 추가)
def get_data(query, params=None):
    try:
        # 바인딩 파라미터 적용
        df = pd.read_sql(query, con=engine, params=params)
        return df
    except Exception as e:
        print("❌ DB 오류:", e)
        return pd.DataFrame()  # 오류 시 빈 DataFrame 반환
