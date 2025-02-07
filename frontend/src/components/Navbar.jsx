import { FaUserCircle, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="flex items-center justify-between p-4 shadow-md bg-white mb-10">
            <div className="flex items-center space-x-4">
                <Link className="navbar-brand mx-auto d-md-inline d-block text-center" to="/">
                    <img src="/logo.png" alt="로고" className="h-8" />
                </Link>
                <div className="flex space-x-18">
                    <Link to="/search" className="text-gray-700 ml-100">
                        탐색
                    </Link>
                    <Link to="/calender" className="text-gray-700 ml-18">
                        캘린더
                    </Link>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="어떤 데이트를 하고 싶으신가요?"
                        className="border-b-2 border-gray-400 pl-2 pr-8 py-1 focus:outline-none w-80"
                    />
                    <Link to={"/searchlist"}>
                        <FaSearch className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    </Link>
                </div>
                <Link to={"/couplecodematch"}>
                    <FaUserCircle className="h-8 w-8 text-gray-700" />
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
