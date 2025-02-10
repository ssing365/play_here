import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Search from "./routes/Search";
import Calender from "./routes/Calender";
import SearchList from "./routes/SearchList";

import CoupleCodeMatch from "./routes/ConnectCouple";
import Place from "./routes/Place";
import MyPage from "./routes/MyPage";
import RegisterPreference from "./routes/RegisterPreference";
import RegisterUser from "./routes/RegisterUser";
import MyPageLikes from "./routes/MyPageLikes";
import RegistUser from "./routes/RegistComponents/RegistUser"


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
                <Route path="/connect-couple" element={<CoupleCodeMatch />} />
            

                <Route path="/regist-preference" element={<RegisterPreference />} />
                <Route path="/regist" element={<RegisterUser />} />
                <Route path="/regist-user" element={<RegistUser />} />
                <Route path="/mypage-likes" element={<MyPageLikes />} />
            </Routes>
        </Router>
    );
}

export default App;
