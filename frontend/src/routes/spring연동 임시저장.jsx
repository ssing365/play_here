// vite와 함께 사용하기 좋은 axios 임포트
import axios from "axios";

import { useEffect, useState } from "react";

const Home = () => {
    const [message, setMessage] = useState("");

    useEffect(() => {
        // 백엔드 API 호출
        axios
            .get("http://localhost:8586/api/hi")
            .then((response) => {
                setMessage(response.data); // 받은 데이터로 상태 업데이트
            })
            .catch((error) => {
                console.error("There was an error!", error);
            });
    }, []); // 빈 배열을 넣어서 컴포넌트가 마운트될 때 한 번만 호출되게 설정
    return (
        <>
            <h1>스프링부트 연동</h1>
            <h1>{message}</h1>
        </>
    );
};

export default Home;
