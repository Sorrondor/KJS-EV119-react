import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as S from './style';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:10000';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

 
  const handleKakaoLogin =() => {
    window.location.href = `${BACKEND_URL}/oauth2/authorization/kakao`;
  };

  const handleNaverLogin = () => {
    window.location.href = `${BACKEND_URL}/oauth2/authorization/naver`;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/member/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
       
        credentials: 'include',
        body: JSON.stringify({
      
          memberEmail: formData.email,
          memberPassword: formData.password,
        }),
      });

      let result = null;
      try {
        result = await response.json();
      } catch {
        result = null;
      }

      if(response.status === 400) {
        setError(result?.message || '입력하신 정보를 다시 확인해주세요.');
      }

      if(response.status === 401) {
        setError(result?.message || '토큰이 없거나 인증에 실패했습니다.');
      }

      if(!response.ok) {
        setError(result?.message || '서버 오류가 발생했습니다.');
      }  
  
      const accessToken = result.data?.accessToken;

      if (!accessToken) {
        throw new Error('입력하신 정보를 다시 확인해주세요.');
      }

     
      localStorage.setItem('accessToken', accessToken);

      
      navigate('/main/mypage');
    } catch (error) {
      console.error(error);
      setError(error.message || '로그인에 실패했습니다.');
    }
  };

  return (
    <S.Container>
      <S.Header>
        <S.Logo to="/">EV119</S.Logo>
        <S.Subtitle>응급실 정보 서비스</S.Subtitle>
      </S.Header>

      <S.MainContent>
        <S.FormCard>
          <S.FormTitle>로그인</S.FormTitle>
          <S.FormSubtitle>이메일과 비밀번호를 입력해주세요</S.FormSubtitle>

          <S.Form onSubmit={handleSubmit}>
            <S.InputGroup>
              <S.Label>이메일</S.Label>
              <S.Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="이메일을 입력하세요"
                required
              />
            </S.InputGroup>

            <S.InputGroup>
              <S.Label>비밀번호</S.Label>
              <S.Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호를 입력하세요"
                required
              />
            </S.InputGroup>

            {error && <S.ErrorMessage>{error}</S.ErrorMessage>}

            <S.SubmitButton type="submit">로그인</S.SubmitButton>

            <S.Divider>
              <S.DividerLine />
              <S.DividerText>또는</S.DividerText>
              <S.DividerLine />
            </S.Divider>

            <S.SocialButtons>
              <S.SocialButton type="button" $variant="kakao" onClick={handleKakaoLogin}>
                <S.SocialIcon>💬</S.SocialIcon>
                카카오 로그인
              </S.SocialButton>
              <S.SocialButton type="button" $variant="naver" onClick={handleNaverLogin}>
                <S.SocialIcon>N</S.SocialIcon>
                네이버 로그인
              </S.SocialButton>
            </S.SocialButtons>

            <S.LinkContainer>
              <S.LinkText>
                계정이 없으신가요? <S.StyledLink to="/auth/signup">회원가입</S.StyledLink>
              </S.LinkText>
            </S.LinkContainer>
          </S.Form>
        </S.FormCard>
      </S.MainContent>
    </S.Container>
  );
};

export default Login;
