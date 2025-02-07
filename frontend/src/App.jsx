import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Search from "./routes/Search";
import Calender from "./routes/Calender";
import SearchList from "./routes/SearchList";

import ConnectCouple from "./routes/ConnectCouple";
import Place from "./routes/Place";
import MyPage from "./routes/MyPage";
import MyPageLikes from "./routes/MyPageLikes";
import Preference from "./routes/Preference";
import EditProfile from "./routes/EditProfile";

import Login from "./routes/Login";
import Regist from "./routes/regist";
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Search />} />
                <Route path="/Login" element={<Login/>} />
                 <Route path="/Regist" element={<Regist/>}/>
                <Route path="/search" element={<Search />} />
                <Route path="/searchlist" element={<SearchList />} />

                <Route path="/place" element={<Place />} />

                <Route path="/calender" element={<Calender />} />

                <Route path="/mypage" element={<MyPage />} />
                <Route path="/connect-couple" element={<ConnectCouple />} />
                <Route path="/mypagelikes" element={<MyPageLikes />} />
                <Route path="/preference" element={<Preference />} />
                <Route path="/editprofile" element={<EditProfile />} />
            </Routes>
        </Router>
    );
}

export default App;
