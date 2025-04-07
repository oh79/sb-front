import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import PostList from './pages/PostList';
import PostDetail from './pages/PostDetail';
import PostCreate from './pages/PostCreate';
import Signup from './pages/Signup';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';

// 네비게이션 컴포넌트 분리
function Navigation() {
  const { isLoggedIn, logout, user, isAdmin } = useAuth();

  return (
    <nav style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
      <Link to="/posts">게시글 목록</Link> |{" "}
      
      {isLoggedIn ? (
        <>
          <span>
            <b>{user.username}</b> 님 (
            {console.log('User Roles:', user.roles)}
            {isAdmin() ? '관리자' : '일반사용자'}
            ) |{" "}
          </span>
          <Link to="/posts/new">글 작성</Link> |{" "}
          <button onClick={logout} style={{ border: 'none', background: 'none', cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}>
            로그아웃
          </button>
        </>
      ) : (
        <>
          <Link to="/signup">회원가입</Link> |{" "}
          <Link to="/login">로그인</Link>
        </>
      )}
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navigation />
        <div style={{ padding: '0 20px' }}>
          <Routes>
            <Route path="/" element={<PostList />} />
            <Route path="/posts" element={<PostList />} />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route path="/posts/new" element={<PostCreate />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
