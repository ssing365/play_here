import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Search from "./routes/Search";
import Calender from "./routes/Calender";
import SearchList from "./routes/SearchList";
import CoupleCodeMatch from "./routes/CoupleCodeMatch";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Search />} />
                <Route path="/search" element={<Search />} />
                <Route path="/calender" element={<Calender />} />
                <Route path="/couplecodematch" element={<CoupleCodeMatch />} />
                <Route path="/searchlist" element={<SearchList />} />
            </Routes>
        </Router>
    );
}

export default App;
