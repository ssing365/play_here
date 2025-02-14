import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Search from "./routes/Search";
import Calender from "./routes/Calender";
import SearchList from "./routes/SearchList";

import ConnectCouple from "./routes/ConnectCouple";

import Place from "./routes/Place";
import MyPage from "./routes/MyPage";

import EditProfile from "./routes/EditProfile";

import Map from './routes/Map';

import RegisterPreference from "./routes/RegisterPreference";
import RegisterUser from "./routes/RegisterUser";
import MyPageLikes from "./routes/MyPageLikes";
import RegisterTerms from "./routes/RegisterTerms";
import RegisterComplete from './routes/RegisterComplete';

function App() {
    return (
        <Router>
            <Routes>
                {/** 메인 */}
                <Route path="/" element={<Search />} />
                <Route path="/search" element={<Search />} />
                
                <Route path="/calender" element={<Calender />} />
                <Route path="/map" element={<Map />} />

                <Route path="/searchlist" element={<SearchList />} />
                <Route path="/place" element={<Place />} />

                <Route path="/mypage" element={<MyPage />} />

                <Route path="/editprofile" element={<EditProfile />} />
                <Route path="/connect-couple" element={<ConnectCouple />} />

                <Route path="/dd" element={<Preference/>} /> {/** 디자인 회의 필요 */}
                

                <Route path="/mypage" element={<MyPage />} />
                <Route path="/connect-couple" element={<CoupleCodeMatch />} />
                  
                {/** 회원가입로직 */}
                <Route path="/register-terms" element={<RegisterTerms/>} />
                <Route path="/register-user" element={<RegisterUser />} />
                <Route path="/register-preference" element={<RegisterPreference />} />
                <Route path="/register-complete" element={<RegisterComplete />} />

                <Route path="/mypage-likes" element={<MyPageLikes />} />
            </Routes>
        </Router>
    );
}

export default App;
