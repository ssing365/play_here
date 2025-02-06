import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Navbar, Nav, Form, Button } from "react-bootstrap";
import '../css/preference.css';

const EditPreference = () => {
  const categories = [
    {
      title: '먹기',
      items: [
        { id: 'rice', icon: '🍚', label: '밥' },
        { id: 'meat', icon: '🥩', label: '고기' },
        { id: 'noodle', icon: '🍜', label: '면' },
        { id: 'seafood', icon: '🐟', label: '해산물' },
        { id: 'street_food', icon: '🌭', label: '길거리' },
        { id: 'pizza_burger', icon: '🍕', label: '피자/버거' },
        { id: 'salad', icon: '🥗', label: '샐러드' }
      ]
    },
    {
      title: '마시기',
      items: [
        { id: 'coffee', icon: '☕', label: '커피' },
        { id: 'tea_drink', icon: '🍵', label: '차/음료' },
        { id: 'dessert', icon: '🍰', label: '디저트' },
        { id: 'beer', icon: '🍺', label: '맥주' },
        { id: 'soju', icon: '🥃', label: '소주' },
        { id: 'makgeolli', icon: '🍶', label: '막걸리' },
        { id: 'wine', icon: '🍷', label: '리큐르/와인' }
      ]
    },
    {
      title: '놀기',
      items: [
        { id: 'indoor', icon: '🎳', label: '실내활동' },
        { id: 'game', icon: '🎮', label: '게임/오락' },
        { id: 'healing', icon: '🧘', label: '힐링' },
        { id: 'vr_escape', icon: '🕶️', label: 'VR/방탈출' }
      ]
    },
    {
      title: '보기',
      items: [
        { id: 'movie', icon: '🎬', label: '영화' },
        { id: 'sports', icon: '⚽', label: '스포츠' },
        { id: 'exhibition', icon: '🖼️', label: '전시' },
        { id: 'performance', icon: '🎭', label: '공연' },
        { id: 'bookstore', icon: '📚', label: '책방' },
        { id: 'shopping', icon: '🛍️', label: '쇼핑' }
      ]
    },
    {
      title: '걷기',
      items: [
        { id: 'market', icon: '🏪', label: '시장' },
        { id: 'park', icon: '🌳', label: '공원' },
        { id: 'theme_street', icon: '🏙️', label: '테마거리' },
        { id: 'scenery', icon: '🏞️', label: '야경/풍경' },
        { id: 'heritage', icon: '🏛️', label: '문화재' }
      ]
    }
  ];

  const [selected, setSelected] = useState({});

  const handleClick = (categoryTitle, item) => {
    setSelected((prevState) => {
      const currentCategory = prevState[categoryTitle] || [];
      if (currentCategory.includes(item.id)) {
        sendDataToServer(categoryTitle, item, false); // 서버로 선택 해제 데이터를 전송
        return {
          ...prevState,
          [categoryTitle]: currentCategory.filter(i => i !== item.id),
        };
      } else {
        sendDataToServer(categoryTitle, item, true); // 서버로 선택 데이터를 전송
        return {
          ...prevState,
          [categoryTitle]: [...currentCategory, item.id],
        };
      }
    });
  };

  const sendDataToServer = (categoryTitle, item, selected) => {
    fetch('https://your-api-endpoint.com/selected', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ category: categoryTitle, item: item.id, selected }),
    })
      .then(response => response.json())
      .then(data => console.log('Success:', data))
      .catch((error) => console.error('Error:', error));
  };

  return (
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
        <div className='col-12 col-lg-6 mb-4'>
        <button className="btn btn-primary mr-2">나의 취향 수정하기</button>
          <br/>
          <button className="btn btn-secondary">돌아가기</button>
        </div>
      </div>
    </div>
  );
};

export default EditPreference;
