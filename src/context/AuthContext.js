import React, { createContext, useContext, useState, useEffect } from 'react';

// 인증 컨텍스트 생성
const AuthContext = createContext(null);

// 컨텍스트 사용을 위한 커스텀 훅
export const useAuth = () => useContext(AuthContext);

// 인증 상태를 제공하는 Provider 컴포넌트
export const AuthProvider = ({ children }) => {
  // 사용자 정보 및 인증 상태
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // 컴포넌트 마운트 시 로컬스토리지에서 인증 정보 복원
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  // 로그인 성공 시 호출되는 함수
  const login = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // 로그아웃 시 호출되는 함수
  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('user');
  };

  // 사용자가 관리자인지 확인하는 헬퍼 함수
  const isAdmin = () => {
    console.log('isAdmin 함수 호출됨, user:', user);
    console.log('user.roles:', user?.roles);
    
    if (!user || !user.roles) return false;
    
    // roles가 문자열인 경우 (예: "ROLE_ADMIN")
    if (typeof user.roles === 'string') {
      return user.roles.includes('ROLE_ADMIN');
    }
    
    // roles가 배열인 경우 (예: ["ROLE_ADMIN", "ROLE_USER"])
    if (Array.isArray(user.roles)) {
      return user.roles.includes('ROLE_ADMIN');
    }
    
    return false;
  };

  // Context Provider를 통해 상태와 함수 제공
  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoggedIn, 
      login, 
      logout,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
}; 