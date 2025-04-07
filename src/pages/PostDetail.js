import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, isAdmin } = useAuth();

  // 게시글 로드
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`http://localhost:8080/api/posts/${id}`, { withCredentials: true });
        setPost(res.data);
        setError('');
      } catch (err) {
        console.error('게시글 로딩 오류:', err);
        setError('게시글을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // 게시글 삭제 처리
  const handleDelete = async () => {
    if (!window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/api/posts/${id}`, { withCredentials: true });
      alert('게시글이 삭제되었습니다.');
      navigate('/posts');
    } catch (err) {
      console.error('삭제 오류:', err);
      alert('게시글 삭제에 실패했습니다.');
    }
  };

  // 현재 사용자가 게시글의 작성자인지 확인
  const isAuthor = () => {
    return user && post && post.user && user.username === post.user.username;
  };

  // 현재 사용자가 게시글을 수정/삭제할 수 있는지 확인
  const canModify = () => {
    return isAdmin() || isAuthor();
  };

  if (isLoading) return <div>게시글을 불러오는 중...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  return (
    <div>
      <h2>게시글 상세</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <Link to="/posts">&lt; 목록으로 돌아가기</Link>
      </div>
      
      <div style={{ 
        border: '1px solid #ddd', 
        borderRadius: '5px', 
        padding: '20px',
        marginBottom: '20px' 
      }}>
        <h3>{post.title}</h3>
        <p style={{ color: '#666' }}>작성자: {post.user?.username}</p>
        <hr />
        <div style={{ whiteSpace: 'pre-wrap', minHeight: '200px' }}>
          {post.content}
        </div>
      </div>
      
      {isAdmin() && !isAuthor() && (
        <div style={{ 
          marginBottom: '20px',
          padding: '10px',
          backgroundColor: '#f0f7ff',
          border: '1px solid #c2e0ff',
          borderRadius: '5px'
        }}>
          <p><strong>관리자 알림:</strong> 다른 사용자의 게시글을 관리하고 있습니다.</p>
        </div>
      )}
      
      {canModify() && (
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => navigate(`/posts/edit/${id}`)} 
            style={{ backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '10px 15px', cursor: 'pointer' }}
          >
            수정하기
          </button>
          <button 
            onClick={handleDelete}
            style={{ backgroundColor: '#f44336', color: 'white', border: 'none', padding: '10px 15px', cursor: 'pointer' }}
          >
            삭제하기
          </button>
        </div>
      )}
    </div>
  );
}

export default PostDetail;
