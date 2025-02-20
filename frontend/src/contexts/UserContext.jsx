import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);  // 추가

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get('/api/user-info', { withCredentials: true });
                console.log(response.data)
                setUserInfo(response.data);
                setIsLoggedIn(true);
            } catch (error) {
                console.error("사용자 정보 가져오기 오류:", error);
                setIsLoggedIn(false);
            } finally {
                setIsLoading(false);  // 추가
            }
        };
        fetchUserInfo();
    }, []);

    if (isLoading) {  // 추가
        return null;
    }

    return (
        <UserContext.Provider value={{ userInfo, setUserInfo, isLoggedIn, setIsLoggedIn }}>
            {children}
        </UserContext.Provider>
    );
};