import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as S from './style';

const MyPage = () => {
  const navigate = useNavigate();

  // 임시 사용자 데이터 (실제로는 Redux나 Context에서 가져옴)
  const userData = {
    name: '홍길동',
    email: 'hong@example.com',
    phone: '010-1234-5678',
    joinDate: '2024.01.15'
  };

  const handleLogout = () => {
    // 로그아웃 로직
    if (window.confirm('로그아웃 하시겠습니까?')) {
      // 실제로는 로그아웃 API 호출 및 상태 초기화
      navigate('/auth/login');
    }
  };

  return (
    <S.Container>
      <S.Header>
        <S.BackButton onClick={() => navigate(-1)}>← 뒤로</S.BackButton>
        <S.Title>마이페이지</S.Title>
      </S.Header>

      <S.Content>
        <S.ProfileSection>
          <S.ProfileImage>
            <S.ProfileIcon>👤</S.ProfileIcon>
          </S.ProfileImage>
          <S.ProfileName>{userData.name}</S.ProfileName>
          <S.ProfileEmail>{userData.email}</S.ProfileEmail>
        </S.ProfileSection>

        <S.MenuSection>
          <S.MenuTitle>계정 관리</S.MenuTitle>
          <S.MenuList>
            <S.MenuItem onClick={() => navigate('/main/profile')}>
              <S.MenuIcon>📝</S.MenuIcon>
              <S.MenuText>회원정보 수정</S.MenuText>
              <S.MenuArrow>›</S.MenuArrow>
            </S.MenuItem>
            <S.MenuItem>
              <S.MenuIcon>🔒</S.MenuIcon>
              <S.MenuText>비밀번호 변경</S.MenuText>
              <S.MenuArrow>›</S.MenuArrow>
            </S.MenuItem>
          </S.MenuList>
        </S.MenuSection>

        <S.MenuSection>
          <S.MenuTitle>건강정보 관리</S.MenuTitle>
          <S.MenuList>
            <S.MenuItem onClick={() => navigate('/main/health')}>
              <S.MenuIcon>🏥</S.MenuIcon>
              <S.MenuText>건강정보 조회/수정</S.MenuText>
              <S.MenuArrow>›</S.MenuArrow>
            </S.MenuItem>
            <S.MenuItem onClick={() => navigate('/main/health')}>
              <S.MenuIcon>💊</S.MenuIcon>
              <S.MenuText>복용 중인 약물</S.MenuText>
              <S.MenuArrow>›</S.MenuArrow>
            </S.MenuItem>
            <S.MenuItem onClick={() => navigate('/main/health')}>
              <S.MenuIcon>⚠️</S.MenuIcon>
              <S.MenuText>알레르기 정보</S.MenuText>
              <S.MenuArrow>›</S.MenuArrow>
            </S.MenuItem>
            <S.MenuItem onClick={() => navigate('/main/health')}>
              <S.MenuIcon>📞</S.MenuIcon>
              <S.MenuText>응급연락처</S.MenuText>
              <S.MenuArrow>›</S.MenuArrow>
            </S.MenuItem>
          </S.MenuList>
        </S.MenuSection>

        <S.MenuSection>
          <S.MenuTitle>병원 방문 이력</S.MenuTitle>
          <S.MenuList>
            <S.MenuItem onClick={() => navigate('/main/visit-history')}>
              <S.MenuIcon>📋</S.MenuIcon>
              <S.MenuText>과거 병원방문 이력</S.MenuText>
              <S.MenuArrow>›</S.MenuArrow>
            </S.MenuItem>
          </S.MenuList>
        </S.MenuSection>

        <S.LogoutButton onClick={handleLogout}>
          로그아웃
        </S.LogoutButton>
      </S.Content>
    </S.Container>
  );
};

export default MyPage;

