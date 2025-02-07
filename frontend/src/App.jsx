import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Search from "./routes/Search";
import Calender from "./routes/Calender";
import SearchList from "./routes/SearchList";

import ConnectCouple from "./routes/ConnectCouple";

import Place from "./routes/Place";
import MyPage from "./routes/MyPage";
import MyPageLikes from "./routes/MyPageLikes";
import EditProfile from "./routes/EditProfile";

import Login from "./routes/Login";
import Regist from "./routes/regist";

import RegisterUser from "./routes/RegistUser"
import RegisterPreference from "./routes/RegisterPreference"
import Preference from "./routes/Preference"

import Map from './routes/Map';

function App() {
    return (
        <Router>
            <Routes>
                {/** 메인 */}
                <Route path="/" element={<Search />} />
                <Route path="/Login" element={<Login/>} />
                 <Route path="/Regist" element={<Regist/>}/>
                <Route path="/search" element={<Search />} />
                
                <Route path="/calender" element={<Calender />} />
                <Route path="/map" element={<Map />} />

                <Route path="/searchlist" element={<SearchList />} />
                <Route path="/place" element={<Place />} />

                <Route path="/mypage" element={<MyPage />} />
                <Route path="/editprofile" element={<EditProfile />} />
                <Route path="/connect-couple" element={<ConnectCouple />} />

                <Route path="/regist" element={<RegisterUser />} />
                <Route path="/preference" element={<RegisterPreference />} />
                <Route path="/dd" element={<Preference/>} /> {/** 디자인 회의 필요 */}
                
                <Route path="/mypagelikes" element={<MyPageLikes />} />
            </Routes>
        </Router>
    );
}

export default App;
