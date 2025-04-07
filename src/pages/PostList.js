import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { isLoggedIn, isAdmin } = useAuth();
  const location = useLocation(); // 페이지 이동 시 전달된 state 확인용
  
  // API URL 변수로 분리
  const API_BASE_URL = 'http://localhost:8080';
  const POSTS_API_URL = `${API_BASE_URL}/api/posts`;

  // 게시글 목록 불러오기
  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      console.log('게시글 목록 요청 시작');
      console.log('요청 URL:', POSTS_API_URL);
      
      const res = await axios.get(POSTS_API_URL, { 
        withCredentials: true,
        // 캐시 방지를 위한 타임스탬프 추가
        params: { 
          _t: new Date().getTime() 
        }
      });
      
      console.log('게시글 목록 응답:', res.data);
      console.log('게시글 목록 응답 타입:', typeof res.data);
      console.log('게시글 목록 길이:', res.data.length);
      // 첫 번째 게시글의 상세 정보 출력
      if (res.data.length > 0) {
        console.log('첫 번째 게시글:', JSON.stringify(res.data[0], null, 2));
        console.log('첫 번째 게시글 ID:', res.data[0].id);
        console.log('첫 번째 게시글 제목:', res.data[0].title);
        console.log('첫 번째 게시글 작성자:', res.data[0].user?.username);
      }

      setPosts(res.data);
      setError('');
    } catch (err) {
      console.error('게시글 로딩 오류:', err);
      console.error('상세 오류 정보:', err.response?.data);
      setError('게시글을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 및 location.state 변경 시 게시글 목록 불러오기
  useEffect(() => {
    console.log('PostList useEffect 실행됨');
    console.log('location.state:', location.state);
    
    fetchPosts();
    
    // location.state?.refresh가 true면 콘솔에 로그 출력
    if (location.state?.refresh) {
      console.log('게시글 작성 후 목록 새로고침');
      
      // navigate()로 전달된 state를 사용한 후에는 초기화
      // 이렇게 하면 사용자가 뒤로가기를 누르거나 다시 목록 페이지로 이동할 때
      // 불필요한 새로고침이 발생하는 것을 방지할 수 있습니다.
      window.history.replaceState({}, document.title);
    }
  }, [location.state]); // 의존성 배열에 location.state 추가

  // DOM 구조 확인용 useEffect 추가
  useEffect(() => {
    if (!isLoading && posts.length > 0) {
      console.log('DOM 구조 확인:');
      console.log('테이블 요소:', document.querySelector('table'));
      console.log('테이블 행 수:', document.querySelectorAll('tbody tr').length);
      console.log('게시글 셀 내용:', Array.from(document.querySelectorAll('td')).map(td => td.textContent));
    }
  }, [isLoading, posts]);

  // 게시글 삭제 기능 (관리자용)
  const handleDeletePost = async (id) => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      try {
        console.log(`게시글 삭제 시도: ID=${id}`);
        
        const deleteUrl = `${POSTS_API_URL}/${id}`;
        console.log('삭제 요청 URL:', deleteUrl);
        
        await axios.delete(deleteUrl, { withCredentials: true });
        
        console.log('게시글 삭제 성공');
        alert('게시글이 삭제되었습니다.');
        
        // 삭제 후 목록 다시 로드
        fetchPosts();
      } catch (err) {
        console.error('삭제 오류:', err);
        console.error('오류 상세:', err.response?.data);
        alert('게시글 삭제에 실패했습니다.');
      }
    }
  };

  return (
    <div>
      <h2>게시글 목록</h2>
      {console.log('렌더링 시 posts 배열:', posts)}
      {console.log('posts 배열 길이:', posts.length)}
      
      {/* 디버깅용 버튼 */}
      <div style={{ marginBottom: '15px' }}>
        <button 
          onClick={() => {
            console.log('수동 새로고침 시도');
            fetchPosts();
          }} 
          style={{ backgroundColor: '#4a90e2', color: 'white', border: 'none', padding: '8px 12px', cursor: 'pointer', marginRight: '10px' }}
        >
          게시글 새로고침
        </button>
        <button 
          onClick={() => {
            console.log('현재 posts 상태:', posts);
            if (posts.length > 0) {
              console.log('첫 번째 게시글:', posts[0]);
            }
          }} 
          style={{ backgroundColor: '#34a853', color: 'white', border: 'none', padding: '8px 12px', cursor: 'pointer' }}
        >
          현재 데이터 확인
        </button>
      </div>
      
      {/* 로그인한 경우만 글 작성 버튼 표시 */}
      {isLoggedIn && (
        <div style={{ marginBottom: '20px' }}>
          <Link to="/posts/new" className="btn-create">
            <button>새 게시글 작성</button>
          </Link>
        </div>
      )}

      {/* 관리자 전용 섹션 */}
      {isAdmin() && (
        <div style={{ 
          marginBottom: '20px', 
          padding: '10px', 
          backgroundColor: '#f8f9fa', 
          border: '1px solid #ddd',
          borderRadius: '5px'
        }}>
          <h3>관리자 전용 메뉴</h3>
          <p>관리자로 로그인했습니다. 모든 게시글을 관리할 수 있습니다.</p>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {/* 디버깅 정보 */}
      <div style={{ margin: '10px 0', padding: '10px', backgroundColor: '#f0f0f0', border: '1px solid #ccc' }}>
        <p>Posts 배열 상태: {posts ? `${posts.length}개 항목 있음` : '비어 있음'}</p>
        <p>로딩 상태: {isLoading ? '로딩 중' : '로딩 완료'}</p>
        <p>오류 상태: {error ? error : '오류 없음'}</p>
        <p>관리자 권한: {isAdmin() ? '예' : '아니오'}</p>
      </div>
      
      {isLoading ? (
        <p>게시글을 불러오는 중...</p>
      ) : (
        <>
          <div style={{ border: '2px solid red', padding: '5px', marginBottom: '10px' }}>
            <p>테이블 렌더링 시작 - 이 텍스트가 보이면 테이블 영역이 시작됨</p>
          </div>

          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            border: '2px solid blue',
            backgroundColor: '#fff',
            fontSize: '16px',
            position: 'relative',
            zIndex: 10,
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>제목</th>
                <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>작성자</th>
                {isAdmin() && <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left', backgroundColor: '#f2f2f2' }}>관리</th>}
              </tr>
            </thead>
            <tbody>
              {posts.length > 0 ? (
                posts.map(post => (
                  <tr key={post.id} style={{ backgroundColor: '#e6f7ff' }}>
                    {console.log('렌더링 중인 게시글:', post)}
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      <Link to={`/posts/${post.id}`}>{post.title}</Link>
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      {post.user?.username}
                    </td>
                    {isAdmin() && (
                      <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                        <button 
                          onClick={() => handleDeletePost(post.id)}
                          style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
                        >
                          삭제
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isAdmin() ? 3 : 2} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', backgroundColor: '#fff0f0' }}>
                    게시글이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          <div style={{ border: '2px solid red', padding: '5px', marginTop: '10px' }}>
            <p>테이블 렌더링 종료 - 이 텍스트가 보이면 테이블 영역이 끝남</p>
          </div>
        </>
      )}
      
      {/* 게시글 직접 출력 - 비상용 */}
      <div style={{ margin: '20px 0', padding: '15px', border: '3px dashed green', backgroundColor: '#e8f5e9' }}>
        <h3>게시글 직접 출력 (비상용)</h3>
        {posts.length > 0 ? (
          <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
            {posts.map(post => (
              <li key={post.id} style={{ margin: '10px 0', fontWeight: 'bold' }}>
                <div>ID: {post.id}</div>
                <div>제목: {post.title}</div>
                <div>내용: {post.content}</div>
                <div>작성자: {post.user?.username}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p>표시할 게시글이 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default PostList;
