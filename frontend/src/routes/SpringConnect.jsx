import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/hello") // 프록시를 사용하므로 백엔드 주소를 직접 입력할 필요 없음
      .then((res) => res.text())
      .then((data) => setMessage(data))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  return (
    <div>
      <h1>React & Spring Boot 연동 테스트</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
