import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  // 사용자 정보를 가져오는 함수
  const fetchUserInfo = async () => {
    try {
      // 현재 인증된 사용자의 정보를 가져오는 API 호출
      const response = await axios.get('http://localhost:8080/api/auth/me', {
        withCredentials: true
      });
      return response.data;
    } catch (err) {
      console.error('사용자 정보 조회 오류:', err);
      return null;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Spring Security 폼 로그인 endpoint 호출
      await axios.post('http://localhost:8080/login', null, {
        params: {
          username,
          password,
        },
        withCredentials: true
      });

      // 로그인 성공 시 사용자 정보 조회
      // 백엔드에 해당 API가 없는 경우 수동으로 사용자 정보 생성
      let userData;
      
      try {
        // 첫 번째 방법: API로 현재 사용자 정보 조회 시도
        userData = await fetchUserInfo();
      } catch (err) {
        // API가 없는 경우, 입력한 username 기반으로 정보 생성
        console.log('사용자 정보 API 없음, 수동으로 정보 생성');
      }
      
      // API 호출이 실패하거나 데이터가 없는 경우 수동으로 정보 생성
      if (!userData) {
        const isAdmin = username === 'admin'; // admin 계정이면 관리자 권한 부여
        userData = {
          username: username,
          roles: isAdmin ? 'ROLE_ADMIN' : 'ROLE_USER'
        };
      }
      
      console.log('저장할 사용자 정보:', userData);
      
      // AuthContext에 사용자 정보 저장
      login(userData);
      
      alert(`환영합니다, ${username}님!`);
      navigate('/posts'); // 로그인 성공 시 게시판 목록으로 이동
    } catch (err) {
      console.error('로그인 오류:', err);
      setError('로그인에 실패했습니다. 사용자명과 비밀번호를 확인해주세요.');
    }
  };

  return (
    <div>
      <h2>로그인</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleLogin}>
        <div>
          <label>Username: </label>
          <input 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required 
          />
        </div>
        <div>
          <label>Password: </label>
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>
        <button type="submit">로그인</button>
      </form>
    </div>
  );
}

export default Login;
