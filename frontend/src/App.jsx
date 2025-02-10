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
import RegisterUser from "./routes/RegistUser"
import RegisterPreference from "./routes/RegisterPreference"
import Preference from "./routes/Preference"

import Map from './routes/Map';

function App() {
    return (
        <Router>
            <Routes>
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
                <Route path="/mypagelikes" element={<MyPageLikes />} />

                {/** 회원가입, 로그인 */}
                <Route path="/Login" element={<Login/>} />
                <Route path="/regist" element={<RegisterUser />} />
                
                {/** 선호도 관련 */}
                <Route path="/preference" element={<RegisterPreference />} />
                <Route path="/dd" element={<Preference/>} /> {/** 디자인 회의 필요 */}
            </Routes>
        </Router>
    );
}

export default App;
