import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PostCreate() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('게시글 작성 요청:', { title, content });
      
      const response = await axios.post('http://localhost:8080/api/posts', 
        { title, content }, 
        { withCredentials: true }
      );
      
      console.log('게시글 작성 응답:', response.data);
      
      alert('작성 완료');
      
      navigate('/posts', { state: { refresh: true } });
    } catch (err) {
      console.error('게시글 작성 오류:', err);
      alert('작성 실패: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div>
      <h2>게시글 작성</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>제목: </label>
          <input 
            value={title}
            onChange={(e) => setTitle(e.target.value)} 
          />
        </div>
        <div>
          <label>내용: </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <button type="submit">작성하기</button>
      </form>
    </div>
  );
}

export default PostCreate;
