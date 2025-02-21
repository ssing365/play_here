import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState(null);

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
            }
            
        };
        fetchUserInfo();
    }, []);

    return (
        <UserContext.Provider value={{ userInfo, setUserInfo, isLoggedIn, setIsLoggedIn }}>
            {children}
        </UserContext.Provider>
    );
};