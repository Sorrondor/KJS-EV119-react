import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as S from './style';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // 에러 초기화
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    }

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다.';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '전화번호를 입력해주세요.';
    } else if (!/^010-\d{4}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = '올바른 전화번호 형식이 아닙니다. (010-0000-0000)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    // 회원가입 로직 (실제로는 API 호출)
    console.log('회원가입 시도:', formData);
    
    // 임시 회원가입 성공 처리
    alert('회원가입이 완료되었습니다.');
    navigate('/auth/login');
  };

  return (
    <S.Container>
      <S.Header>
        <S.Logo to="/">EV119</S.Logo>
        <S.Subtitle>응급실 정보 서비스</S.Subtitle>
      </S.Header>

      <S.MainContent>
        <S.FormCard>
          <S.FormTitle>회원가입</S.FormTitle>
          <S.FormSubtitle>정보를 입력하여 계정을 만드세요</S.FormSubtitle>

          <S.Form onSubmit={handleSubmit}>
            <S.InputGroup>
              <S.Label>이름</S.Label>
              <S.Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="이름을 입력하세요"
                required
              />
              {errors.name && <S.FieldError>{errors.name}</S.FieldError>}
            </S.InputGroup>

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
              {errors.email && <S.FieldError>{errors.email}</S.FieldError>}
            </S.InputGroup>

            <S.InputGroup>
              <S.Label>비밀번호</S.Label>
              <S.Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="8자 이상 입력하세요"
                required
              />
              {errors.password && <S.FieldError>{errors.password}</S.FieldError>}
            </S.InputGroup>

            <S.InputGroup>
              <S.Label>비밀번호 확인</S.Label>
              <S.Input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="비밀번호를 다시 입력하세요"
                required
              />
              {errors.confirmPassword && <S.FieldError>{errors.confirmPassword}</S.FieldError>}
            </S.InputGroup>

            <S.InputGroup>
              <S.Label>전화번호</S.Label>
              <S.Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="010-0000-0000"
                required
              />
              {errors.phone && <S.FieldError>{errors.phone}</S.FieldError>}
            </S.InputGroup>

            <S.SubmitButton type="submit">회원가입</S.SubmitButton>

            <S.LinkContainer>
              <S.LinkText>
                이미 계정이 있으신가요? <S.StyledLink to="/auth/login">로그인</S.StyledLink>
              </S.LinkText>
            </S.LinkContainer>
          </S.Form>
        </S.FormCard>
      </S.MainContent>
    </S.Container>
  );
};

export default SignUp;

