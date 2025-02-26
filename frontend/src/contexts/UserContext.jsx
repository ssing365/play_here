import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);  // 추가
    const [forceRender, setForceRender] = useState(0);  // ✅ 강제 리렌더링 상태 추가


    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await axios.get('/api/user-info', { withCredentials: true });
                console.log(response.data);
                console.log("📡 [UserContext] 사용자 정보 로드:", response.data);
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

    // ✅ userInfo가 변경될 때마다 강제 리렌더링 유도
    const updateUserInfo = (newInfo) => {
        console.log("🛠 [UserContext] updateUserInfo 호출됨: ", newInfo);
        setUserInfo(newInfo);
        setForceRender((prev) => prev + 1);
    };


    if (isLoading) {  // 추가
        return null;
    }
    return (
        <UserContext.Provider value={{ userInfo, setUserInfo, updateUserInfo, isLoggedIn, setIsLoggedIn, forceRender }}>
            {children}
        </UserContext.Provider>
    );
};
