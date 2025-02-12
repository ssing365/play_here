import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Navbar, Nav, Form, Button } from "react-bootstrap";
import './css/preference.css';


const RegisterPreference = () => {
  const categories = [
    {
      title: '먹기',
      items: [
        { id: 1, icon: '🍚', label: '밥' },
        { id: 2, icon: '🥩', label: '고기' },
        { id: 3, icon: '🍜', label: '면' },
        { id: 4, icon: '🐟', label: '해산물' },
        { id: 5, icon: '🌭', label: '길거리' },
        { id: 6, icon: '🍕', label: '피자/버거' },
        { id: 7, icon: '🥗', label: '샐러드' }
      ]
    },
    {
      title: '마시기',
      items: [
        { id: 8, icon: '☕', label: '커피' },
        { id: 9, icon: '🍵', label: '차/음료' },
        { id: 10, icon: '🍰', label: '디저트' },
        { id: 11, icon: '🍺', label: '맥주' },
        { id: 12, icon: '🥃', label: '소주' },
        { id: 13, icon: '🍶', label: '막걸리' },
        { id: 14, icon: '🍷', label: '리큐르/와인' }
      ]
    },
    {
      title: '놀기',
      items: [
        { id: 15, icon: '🎳', label: '실내활동' },
        { id: 16, icon: '🎮', label: '게임/오락' },
        { id: 17, icon: '🧘', label: '힐링' },
        { id: 18, icon: '🕶️', label: 'VR/방탈출' }
      ]
    },
    {
      title: '보기',
      items: [
        { id: 19, icon: '🎬', label: '영화' },
        { id: 20, icon: '⚽', label: '스포츠' },
        { id: 21, icon: '🖼️', label: '전시' },
        { id: 22, icon: '🎭', label: '공연' },
        { id: 23, icon: '📚', label: '책방' },
        { id: 24, icon: '🛍️', label: '쇼핑' }
      ]
    },
    {
      title: '걷기',
      items: [
        { id: 25, icon: '🏪', label: '시장' },
        { id: 26, icon: '🌳', label: '공원' },
        { id: 27, icon: '🏙️', label: '테마거리' },
        { id: 28, icon: '🏞️', label: '야경/풍경' },
        { id: 29, icon: '🏛️', label: '문화재' }
      ]
    }
  ];

  const [selected, setSelected] = useState({});

  const handleClick = (categoryTitle, item) => {
    setSelected((prevState) => {
      const currentCategory = prevState[categoryTitle] || [];
      if (currentCategory.includes(item.id)) {
        sendDataToServer(item, false); // 서버로 선택 해제 데이터를 전송
        return {
          ...prevState,
          [categoryTitle]: currentCategory.filter(i => i !== item.id),
        };
      } else {
        sendDataToServer(item, true); // 서버로 선택 데이터를 전송
        return {
          ...prevState,
          [categoryTitle]: [...currentCategory, item.id],
        };
      }
    });
  };

  //서버로 데이터를 전송
  const sendDataToServer = ( item, selected) => {
    fetch('https://your-api-endpoint.com/selected', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ item: item.id, selected }),
    })
      .then(response => response.json())
      .then(data => console.log('Success:', data))
      .catch((error) => console.error('Error:', error));
  };

  return (
    // NavBar 추가하기

    <div className="container mt-5">
      <div className="row">
        {categories.map(category => (
          <div key={category.title} className="col-12 col-lg-6 mb-4">
            <h3>{category.title}</h3>
            <div className="d-flex flex-wrap">
              {category.items.map(item => (
                <div
                  key={item.id}
                  className={`icon ${selected[category.title]?.includes(item.id) ? 'selected' : ''}`}
                  onClick={() => handleClick(category.title, item)}
                >
                  <span className="icon-content">{item.icon}<br/>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className='col-12 col-lg-6 mb-4' style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '22px', marginBottom: '10px', display: 'block'  }}>선호도는 마이페이지에서 수정 가능합니다.</span>
          <br/>
          <button className="btn btn-primary mr-2"
            style={{ fontSize: '20px', padding: '10px 20px', margin: '10px 0', width: '200px' }}>
              선택완료
          </button>
          <br/>
          <button className="btn btn-secondary"
            style={{ fontSize: '20px', padding: '10px 20px', margin: '10px 0', width: '200px' }}>
              다음에 고르기
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPreference;
