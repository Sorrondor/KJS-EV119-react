import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as S from './style';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    // 로그인 로직 (실제로는 API 호출)
    console.log('로그인 시도:', formData);
    
    // 임시 로그인 성공 처리
    // 실제로는 API 응답에 따라 처리
    navigate('/main/mypage');
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
              <S.SocialButton type="button" $variant="kakao">
                <S.SocialIcon>💬</S.SocialIcon>
                카카오 로그인
              </S.SocialButton>
              <S.SocialButton type="button" $variant="naver">
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

