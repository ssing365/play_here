import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Search from "./routes/Search";
import Calender from "./routes/Calender";
import SearchList from "./routes/SearchList";

import CoupleCodeMatch from "./routes/ConnectCouple";
import Place from "./routes/Place";
import MyPage from "./routes/MyPage";
import RegisterUser from "./routes/RegisterUser";

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
                <Route path="/connect-couple" element={<CoupleCodeMatch />} />
            </Routes>
        </Router>
    );
}

export default App;
