import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Search from './pages/Search';
import Calender from './pages/Calender';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
		<Route path="/search" element={<Search />} />
		<Route path="/calender" element={<Calender />} />
      </Routes>
    </Router>
  );
}

export default App;
