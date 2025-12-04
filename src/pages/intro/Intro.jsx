import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as S from './style';

const Intro = () => {
  const navigate = useNavigate();

  const handleAmbulanceCall = () => {
    window.location.href = 'tel:119';
  };

  const handleEmergencyRoomInfo = () => {
    navigate('/main/map');
  };

  const handleHelp = () => {
    navigate('/main/help');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      const searchTerm = e.target.value;
      if (searchTerm.trim()) {
        // 검색 기능 구현
        console.log('검색어:', searchTerm);
        navigate('/main/map');
      }
    }
  };

  return (
    <S.Container>
      <S.Header>
        <S.Logo>EV119</S.Logo>
        <S.Subtitle>응급실 정보 서비스</S.Subtitle>
      </S.Header>

      <S.MainContent>
        <S.PrimaryActions>
          <S.EmergencyButton 
            onClick={handleAmbulanceCall}
            $variant="ambulance"
          >
            <S.ButtonIcon>🚨</S.ButtonIcon>
            <S.ButtonText>
              <S.ButtonTitle>구급차 호출</S.ButtonTitle>
              <S.ButtonSubtitle>119 신고</S.ButtonSubtitle>
            </S.ButtonText>
          </S.EmergencyButton>
          
          <S.EmergencyButton 
            onClick={handleEmergencyRoomInfo}
            $variant="info"
          >
            <S.ButtonIcon>🏥</S.ButtonIcon>
            <S.ButtonText>
              <S.ButtonTitle>응급실 정보</S.ButtonTitle>
              <S.ButtonSubtitle>주변 응급실 찾기</S.ButtonSubtitle>
            </S.ButtonText>
          </S.EmergencyButton>
        </S.PrimaryActions>

        <S.SearchSection>
          <S.SearchLabel>지역·병원명 검색</S.SearchLabel>
          <S.SearchInput
            type="text"
            placeholder="검색어를 입력하세요"
            onKeyPress={handleSearch}
          />
        </S.SearchSection>

        <S.QuickLinks>
          <S.QuickLinkItem onClick={handleHelp}>
            <S.LinkIcon>ℹ️</S.LinkIcon>
            <S.LinkText>도움말</S.LinkText>
          </S.QuickLinkItem>
          <S.QuickLinkItem onClick={() => navigate('/main/map')}>
            <S.LinkIcon>📍</S.LinkIcon>
            <S.LinkText>내 위치 찾기</S.LinkText>
          </S.QuickLinkItem>
        </S.QuickLinks>
      </S.MainContent>

      <S.Footer>
        <S.FooterText>응급 상황 시 즉시 119에 신고하세요</S.FooterText>
      </S.Footer>
    </S.Container>
  );
};

export default Intro;

