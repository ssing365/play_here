import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import Search from "./routes/Search";
import Calender from "./routes/Calender";
import SearchList from "./routes/SearchList";
import ConnectCouple from "./routes/ConnectCouple";
import Place from "./routes/Place";
import MyPage from "./routes/MyPage";

import MyPageLikes from "./routes/MyPageLikes";
import EditProfile from "./routes/EditProfile";
import Login from "./routes/Login";
import RegisterComplete from "./routes/RegisterComplete";
import { NaverCallback } from "./components/NaverLogin"
import EditPreference from "./routes/EditPreference"

import Map from './routes/Map';

import RegisterPreference from "./routes/RegisterPreference";
import RegisterUser from "./routes/RegisterUser";
import RegisterTerms from "./routes/RegisterTerms";

function App() {
    return (
        
        <Router>
            <Routes>
                {/** 메인 */}
                {/** 메인, 장소 */}
                {/* 기본 경로를 /home으로 리디렉션 */}
                <Route path="/" element={<Navigate to="/search" />} />
                <Route path="/search" element={<Search />} />
                <Route path="/searchlist" element={<SearchList />} />
                <Route path="/place" element={<Place />} />

                {/** 지도, 캘린더 */}
                <Route path="/calender" element={<Calender />} />
                <Route path="/map" element={<Map />} />

                {/** 마이페이지 관련 */}
                <Route path="/mypage" element={<MyPage />} />

                <Route path="/editprofile" element={<EditProfile />} />
                <Route path="/connect-couple" element={<ConnectCouple />} />
                <Route path="/editpreference" element={<EditPreference/>} />

                <Route path="/mypagelikes" element={<MyPageLikes />} />

                {/** 회원가입, 로그인 */}
                <Route path="/Login" element={<Login/>} />
                <Route path="/oauth/callback/naver" element={<NaverCallback/>} />
               
                  
                {/** 회원가입로직 (약관 - 회원가입 폼 - 선호도 - 회원가입 완료) */}

                <Route path="/register-terms" element={<RegisterTerms/>} />
                <Route path="/register-user" element={<RegisterUser />} />
                <Route path="/register-preference" element={<RegisterPreference />} />
                <Route path="/register-complete" element={<RegisterComplete />} />
            </Routes>
        </Router>
    );
}

export default App;
