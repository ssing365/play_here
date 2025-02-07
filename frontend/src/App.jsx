import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Search from "./routes/Search";
import Calender from "./routes/Calender";
import SearchList from "./routes/SearchList";
import CoupleCodeMatch from "./routes/CoupleCodeMatch";
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
                <Route path="/calender" element={<Calender />} />
                <Route path="/couplecodematch" element={<CoupleCodeMatch />} />
                <Route path="/searchlist" element={<SearchList />} />
            </Routes>
        </Router>
    );
}

export default App;
