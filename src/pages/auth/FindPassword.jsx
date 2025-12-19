import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as S from './style';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:10000';

const FindPassword = () => {
  const navigate = useNavigate();

  const [memberPhone, setMemberPhone] = useState('');
  const [authCode, setAuthCode] = useState('');

  const [step, setStep] = useState(1); 
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePhoneChange = (e) => {
    const onlyNumber = e.target.value.replace(/[^\d]/g, '');
    setMemberPhone(onlyNumber);
    setError('');
    setInfo('');
  };

  const handleCodeChange = (e) => {
    const onlyNumber = e.target.value.replace(/[^\d]/g, '');
    setAuthCode(onlyNumber);
    setError('');
    setInfo('');
  };


  const sendAuthCode = async () => {
    if (!memberPhone) {
      setError('휴대폰 번호를 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(
        `${BACKEND_URL}/sms/send?memberPhone=${encodeURIComponent(memberPhone)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      let result = null;
      try {
        result = await response.json();
      } catch {
        result = null;
      }

      if (!response.ok) {
        setError(result?.message || '인증번호 발송에 실패했습니다.');
        return;
      }

      setInfo(result?.message || '인증번호가 발송되었습니다.');
      setStep(2);
    } catch (e) {
      console.error(e);
      setError('인증번호 발송 중 서버 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };


  const verifyAuthCode = async () => {
    if (!authCode) {
      setError('인증번호를 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(
        `${BACKEND_URL}/sms/verify?memberPhone=${encodeURIComponent(memberPhone)}&authCode=${encodeURIComponent(authCode)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      let result = null;
      try {
        result = await response.json();
      } catch {
        result = null;
      }

      if (!response.ok) {
        setError(result?.message || '인증번호가 일치하지 않습니다.');
        return;
      }

      const resetToken = result?.resetToken;

      if(!resetToken) {
        setError("refreshToken이 응답에 없습니다.");
        return;
      }

      setInfo(result?.message || '인증되었습니다.');

      navigate('/auth/reset-password', {
      state: {
        resetToken,
        memberPhone,
      },
    });
  } catch (e) {
    console.error(e);
    setError('인증 처리 중 서버 오류가 발생했습니다.');
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
          <S.FormTitle>비밀번호 찾기</S.FormTitle>
          <S.FormSubtitle>
            {step === 1
              ? '휴대폰 번호를 입력해주세요'
              : '인증번호를 입력해주세요'}
          </S.FormSubtitle>

          <S.Form onSubmit={(e) => e.preventDefault()}>
            {step === 1 && (
              <S.InputGroup>
                <S.Label>휴대폰 번호</S.Label>
                <S.Input
                  type="text"
                  value={memberPhone}
                  onChange={handlePhoneChange}
                  placeholder="휴대폰 번호를 입력하세요 (숫자만)"
                  required
                />
              </S.InputGroup>
            )}

            {step === 2 && (
              <>
                <S.InputGroup>
                  <S.Label>휴대폰 번호</S.Label>
                  <S.Input
                    type="text"
                    value={memberPhone}
                    onChange={handlePhoneChange}
                    placeholder="휴대폰 번호"
                    required
                  />
                </S.InputGroup>

                <S.InputGroup>
                  <S.Label>인증번호</S.Label>
                  <S.Input
                    type="text"
                    value={authCode}
                    onChange={handleCodeChange}
                    placeholder="인증번호를 입력하세요"
                    required
                  />
                </S.InputGroup>
              </>
            )}

            {error && <S.ErrorMessage>{error}</S.ErrorMessage>}
            {info && <S.InfoMessage>{info}</S.InfoMessage>}

            {step === 1 ? (
              <S.SubmitButton
                type="button"
                onClick={sendAuthCode}
                disabled={isLoading}
              >
                {isLoading ? '발송 중...' : '인증번호 발송'}
              </S.SubmitButton>
            ) : (
              <S.ButtonRow>
                <S.GhostButton
                  type="button"
                  onClick={sendAuthCode}
                  disabled={isLoading}
                >
                  재발송
                </S.GhostButton>

                <S.SubmitButton
                  type="button"
                  onClick={verifyAuthCode}
                  disabled={isLoading}
                >
                  {isLoading ? '검증 중...' : '인증번호 확인'}
                </S.SubmitButton>
              </S.ButtonRow>
            )}

            <S.LinkContainer>
              <S.LinkText>
                로그인으로 돌아가기{' '}
                <S.StyledLink to="/auth/login">로그인</S.StyledLink>
              </S.LinkText>

              {step === 2 && (
                <S.LinkText>
                  번호를 다시 입력하시겠어요?{' '}
                  <S.TextButton
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setAuthCode('');
                      setError('');
                      setInfo('');
                    }}
                  >
                    이전 단계
                  </S.TextButton>
                </S.LinkText>
              )}
            </S.LinkContainer>
          </S.Form>
        </S.FormCard>
      </S.MainContent>
    </S.Container>
  );
};

export default FindPassword;
