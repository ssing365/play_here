import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState(null);

    //기존코드 
    //컴포넌트 마운트 시 실행 
    // useEffect(() => {
    //     const fetchUserInfo = async () => {
    //         try {
    //             const response = await axios.get("http://localhost:8586/api/user-info", { withCredentials: true });
    //             console.log(response.data)
    //             setUserInfo(response.data);
    //             setIsLoggedIn(true);
    //         } catch (error) {
    //             console.error("사용자 정보 가져오기 오류:", error);
    //             setIsLoggedIn(false);
    //         }
    //     };
    //     fetchUserInfo();
    // }, []);

    // 사용자 정보 불러오는 함수
    const fetchUserInfo = async () => {
        if (isLoggedIn && userInfo) return; //이미 로그인된 상태면 불필요
        try {
            const response = await axios.get("http://localhost:8586/api/user-info", { withCredentials: true });
            setUserInfo(response.data);
            setIsLoggedIn(true);
        } catch (error) {
            console.error("사용자 정보 가져오기 오류:", error);
            setUserInfo(null);
            setIsLoggedIn(false);
        }
    };

    


    return (
        <UserContext.Provider value={{ userInfo, setUserInfo, isLoggedIn, setIsLoggedIn, fetchUserInfo }}>
            {children}
        </UserContext.Provider>
    );
};