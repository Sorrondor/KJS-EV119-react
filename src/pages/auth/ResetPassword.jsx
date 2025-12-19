import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as S from './style';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:10000';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const resetToken = state?.resetToken || '';
  const memberPhone = state?.memberPhone || '';

  const [newPassword, setNewPassword] = useState('');
  const [newPassword2, setNewPassword2] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setInfo('');

    if (!resetToken) {
      setError('인증 정보가 없습니다. 비밀번호 찾기부터 다시 진행해주세요.');
      return;
    }
    if (!newPassword || !newPassword2) {
      setError('새 비밀번호를 모두 입력해주세요.');
      return;
    }
    if (newPassword.length < 8) {
      setError('비밀번호는 최소 8자 이상이어야 합니다.');
      return;
    }
    if (newPassword !== newPassword2) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(`${BACKEND_URL}/api/member/password/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resetToken,
          newPassword,
        }),
      });

      let result = null;
      try {
        result = await response.json();
      } catch {
        result = null;
      }

      if (!response.ok) {
        setError(result?.message || '비밀번호 변경에 실패했습니다.');
        return;
      }

      setInfo('비밀번호가 변경되었습니다. 다시 로그인해주세요.');
      setTimeout(() => navigate('/auth/login'), 800);
    } catch (e) {
      console.error(e);
      setError('서버 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
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
          <S.FormTitle>비밀번호 재설정</S.FormTitle>
          <S.FormSubtitle>
            {memberPhone ? `${memberPhone} 계정의 새 비밀번호를 설정해주세요` : '새 비밀번호를 설정해주세요'}
          </S.FormSubtitle>

          <S.Form onSubmit={(e) => e.preventDefault()}>
            <S.InputGroup>
              <S.Label>새 비밀번호</S.Label>
              <S.Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="8자 이상 입력"
              />
            </S.InputGroup>

            <S.InputGroup>
              <S.Label>새 비밀번호 확인</S.Label>
              <S.Input
                type="password"
                value={newPassword2}
                onChange={(e) => setNewPassword2(e.target.value)}
                placeholder="비밀번호를 다시 입력"
              />
            </S.InputGroup>

            {error && <S.ErrorMessage>{error}</S.ErrorMessage>}
            {info && <S.InfoMessage>{info}</S.InfoMessage>}

            <S.SubmitButton type="button" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? '변경 중...' : '비밀번호 변경'}
            </S.SubmitButton>

            <S.LinkContainer>
              <S.LinkText>
                로그인으로 돌아가기 <S.StyledLink to="/auth/login">로그인</S.StyledLink>
              </S.LinkText>
            </S.LinkContainer>
          </S.Form>
        </S.FormCard>
      </S.MainContent>
    </S.Container>
  );
};

export default ResetPassword;
