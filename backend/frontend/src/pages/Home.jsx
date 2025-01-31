import {Link} from 'react-router-dom';

const Home = () => {
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
      <p>여기는 상단바의 여기놀자 로고를 클릭했을 때 나오는 메인 페이지입니다. 탐색 탭과 같습니다.</p>
    </>
  );
};

export default Home;
