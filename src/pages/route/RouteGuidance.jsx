import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserHeader from '../../components/header/UserHeader';
import * as S from './style';

const RouteGuidance = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [routeInfo, setRouteInfo] = useState(null);

  const emergencyRooms = {
    1: {
      name: '강남서울 응급의료센터',
      address: '서울 강남구 테헤란로 123',
      distance: '0.8 km',
      time: '도보 약 10분',
      carTime: '차량 약 3분'
    },
    2: {
      name: '역삼성모병원 응급실',
      address: '서울 강남구 역삼로 45',
      distance: '1.4 km',
      time: '도보 약 18분',
      carTime: '차량 약 5분'
    },
    3: {
      name: '한빛대학교병원 응급센터',
      address: '서울 서초구 서초대로 201',
      distance: '2.7 km',
      time: '도보 약 35분',
      carTime: '차량 약 10분'
    }
  };

  useEffect(() => {
    const selectedRoom = emergencyRooms[id];
    if (selectedRoom) {
      setRouteInfo({
        ...selectedRoom,
        currentLocation: '서울 강남구 역삼동 근처',
        routeType: 'walking' // 'walking' or 'driving'
      });
    }
  }, [id]);

  if (!routeInfo) {
    return (
      <S.Container>
        <S.Loading>로딩 중...</S.Loading>
      </S.Container>
    );
  }

  const handleStartNavigation = () => {
    // Navigation 페이지로 이동
    navigate(`/main/navigation/${id}`);
  };

  const handleToggleRoute = () => {
    setRouteInfo({
      ...routeInfo,
      routeType: routeInfo.routeType === 'walking' ? 'driving' : 'walking'
    });
  };

  return (
    <S.Container>
      <UserHeader />
      <S.Header>
        <S.BackButton onClick={() => navigate(-1)}>← 뒤로</S.BackButton>
        <S.Title>경로 안내</S.Title>
      </S.Header>

      <S.Content>
        <S.DestinationCard>
          <S.DestinationIcon>🏥</S.DestinationIcon>
          <S.DestinationInfo>
            <S.DestinationName>{routeInfo.name}</S.DestinationName>
            <S.DestinationAddress>{routeInfo.address}</S.DestinationAddress>
          </S.DestinationInfo>
        </S.DestinationCard>

        <S.RouteInfo>
          <S.RouteToggle>
            <S.ToggleButton
              $active={routeInfo.routeType === 'walking'}
              onClick={() => setRouteInfo({ ...routeInfo, routeType: 'walking' })}
            >
              🚶 도보
            </S.ToggleButton>
            <S.ToggleButton
              $active={routeInfo.routeType === 'driving'}
              onClick={() => setRouteInfo({ ...routeInfo, routeType: 'driving' })}
            >
              🚗 차량
            </S.ToggleButton>
          </S.RouteToggle>

          <S.RouteDetails>
            <S.RouteItem>
              <S.RouteLabel>출발지</S.RouteLabel>
              <S.RouteValue>{routeInfo.currentLocation}</S.RouteValue>
            </S.RouteItem>
            <S.RouteArrow>↓</S.RouteArrow>
            <S.RouteItem>
              <S.RouteLabel>도착지</S.RouteLabel>
              <S.RouteValue>{routeInfo.name}</S.RouteValue>
            </S.RouteItem>
            <S.RouteDivider />
            <S.RouteItem>
              <S.RouteLabel>거리</S.RouteLabel>
              <S.RouteValue $highlight>{routeInfo.distance}</S.RouteValue>
            </S.RouteItem>
            <S.RouteItem>
              <S.RouteLabel>예상 소요 시간</S.RouteLabel>
              <S.RouteValue $highlight>
                {routeInfo.routeType === 'walking' ? routeInfo.time : routeInfo.carTime}
              </S.RouteValue>
            </S.RouteItem>
          </S.RouteDetails>
        </S.RouteInfo>

        <S.MapArea>
          <S.MapPlaceholder>
            <S.MapInstruction>
              지도가 여기에 표시됩니다
            </S.MapInstruction>
          </S.MapPlaceholder>
        </S.MapArea>

        <S.RouteSteps>
          <S.StepsTitle>경로 안내</S.StepsTitle>
          <S.StepItem>
            <S.StepNumber>1</S.StepNumber>
            <S.StepText>현재 위치에서 출발</S.StepText>
          </S.StepItem>
          <S.StepItem>
            <S.StepNumber>2</S.StepNumber>
            <S.StepText>테헤란로 방면으로 직진</S.StepText>
          </S.StepItem>
          <S.StepItem>
            <S.StepNumber>3</S.StepNumber>
            <S.StepText>강남서울병원 도착</S.StepText>
          </S.StepItem>
        </S.RouteSteps>
      </S.Content>

      <S.ActionButtons>
        <S.PrimaryButton onClick={handleStartNavigation}>
          네비게이션 시작
        </S.PrimaryButton>
        <S.SecondaryButton onClick={() => navigate(`/main/emergency-room/${id}`)}>
          상세 정보 보기
        </S.SecondaryButton>
      </S.ActionButtons>
    </S.Container>
  );
};

export default RouteGuidance;

