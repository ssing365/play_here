import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Search from "./routes/Search";
import Calender from "./routes/Calender";
import SearchList from "./routes/SearchList";

import ConnectCouple from "./routes/ConnectCouple";

import Place from "./routes/Place";
import MyPage from "./routes/MyPage";
import MyPageLikes from "./routes/MyPageLikes";
import EditProfile from "./routes/EditProfile";

import RegisterUser from "./routes/RegisterUser"
import RegisterPreference from "./routes/RegisterPreference"


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Search />} />
                <Route path="/search" element={<Search />} />
                <Route path="/searchlist" element={<SearchList />} />


                <Route path="/place" element={<Place />} />

                <Route path="/calender" element={<Calender />} />

                <Route path="/mypage" element={<MyPage />} />

                <Route path="/registerUser" element={<RegisterUser />} />
                <Route path="/regist" element={<RegisterUser />} />
                <Route path="/preference" element={<RegisterPreference />} />
                <Route path="/connect-couple" element={<ConnectCouple />} />
                <Route path="/mypagelikes" element={<MyPageLikes />} />
                <Route path="/editprofile" element={<EditProfile />} />
            </Routes>
        </Router>
    );
}

export default App;
