import {Link} from 'react-router-dom';

const Search = () => {
  return (
    <>
	<nav>
	  <ul>
	    <li><Link to="/">여기놀자</Link></li>
	    <li><Link to="/">탐색</Link></li>
	    <li><Link to="/calender">캘린더</Link></li>
	  </ul>
	  </nav>
      <h1>여기놀자</h1>
      <p>여기는 탐색탭입니다.</p>
    </>
  );
};

export default Search;