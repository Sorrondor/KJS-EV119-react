import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PatientAlertButton from '../../components/patientAlert/PatientAlertButton';
import UserHeader from '../../components/header/UserHeader';
import * as S from './style';

const MapContainer = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('distance');

  const emergencyRooms = [
    {
      id: 1,
      name: '강남서울 응급의료센터',
      address: '서울 강남구 테헤란로 123, 강남서울병원 B동 1층 응급실',
      hours: '24시간 응급실 운영',
      distance: '0.8 km',
      time: '도보 약 10분',
      status: 'crowded',
      waiting: 12,
      specialties: ['뇌·심혈관 전문', '중증 응급 수용 가능']
    },
    {
      id: 2,
      name: '역삼성모병원 응급실',
      address: '서울 강남구 역삼로 45, 역삼성모병원 본관 지하 1층',
      distance: '1.4 km',
      time: '차량 5분',
      status: 'available',
      waiting: 3,
      specialties: ['소아 응급 가능', '구급차 우선']
    },
    {
      id: 3,
      name: '한빛대학교병원 응급센터',
      address: '서울 서초구 서초대로 201, 한빛의료타워 1층 응급의료센터',
      distance: '2.7 km',
      time: '차량 10분',
      status: 'full',
      waiting: 0,
      specialties: ['중증외상센터', 'ICU 만실']
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return '#00C853';
      case 'crowded':
        return '#FF9800';
      case 'full':
        return '#CD0B16';
      default:
        return '#9E9E9E';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'available':
        return '여유';
      case 'crowded':
        return '혼잡';
      case 'full':
        return '포화';
      default:
        return '';
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      console.log('검색어:', searchTerm);
    }
  };

  const handleRelocate = () => {
    console.log('위치 재탐색');
  };

  const handleNearestRoute = () => {
    // 가장 가까운 응급실 찾기
    const nearestRoom = emergencyRooms.sort((a, b) => {
      const distanceA = parseFloat(a.distance);
      const distanceB = parseFloat(b.distance);
      return distanceA - distanceB;
    })[0];
    
    if (nearestRoom) {
      navigate(`/main/route/${nearestRoom.id}`);
    }
  };

  return (
    <S.Container>
      <UserHeader />
      <S.Header>
        <S.Title>EV 주변 응급실 한눈에 보기</S.Title>
        <S.Description>
          사용자의 현재 위치를 기준으로 응급실 위치와 상태를 실시간으로 정렬해서 보여주는 화면입니다.
        </S.Description>
        <S.LocationInfo>
          <S.LocationDot />
          <span>현재 위치: 서울 강남구 역삼동 근처</span>
        </S.LocationInfo>
        <S.HeaderControls>
          <S.SearchInput
            type="text"
            placeholder="지역·병원명으로 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleSearch}
          />
          <S.RelocateButton onClick={handleRelocate}>
            내 위치 재탐색
          </S.RelocateButton>
          <S.NearestRouteButton onClick={handleNearestRoute}>
            가까운 경로 안내
          </S.NearestRouteButton>
        </S.HeaderControls>
        <S.Legend>
          <S.LegendItem>
            <S.LegendDot $color="#00C853" />
            <span>응급실(여유)</span>
          </S.LegendItem>
          <S.LegendItem>
            <S.LegendDot $color="#FF9800" />
            <span>응급실(혼잡)</span>
          </S.LegendItem>
          <S.LegendItem>
            <S.LegendDot $color="#CD0B16" />
            <span>응급실(포화)</span>
          </S.LegendItem>
        </S.Legend>
      </S.Header>

      <S.MainContent>
        <S.MapArea>
          <S.MapPlaceholder>
            <S.MapInstruction>
              드래그 지도를 움직여 다른 구역의 응급실을 탐색할 수 있습니다.
            </S.MapInstruction>
          </S.MapPlaceholder>
        </S.MapArea>

        <S.InfoPanel>
          <S.PanelHeader>
            <S.PanelTitle>주변 응급실</S.PanelTitle>
            <S.FilterInfo>반경 약 5km 내 응급의료기관 기준</S.FilterInfo>
            <S.SortSelect value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="distance">정렬 기준 거리순</option>
              <option value="status">정렬 기준 상태순</option>
            </S.SortSelect>
          </S.PanelHeader>

          <S.StatusLegend>
            <S.LegendItem>
              <S.LegendDot $color="#00C853" />
              <span>여유</span>
            </S.LegendItem>
            <S.LegendItem>
              <S.LegendDot $color="#FF9800" />
              <span>혼잡</span>
            </S.LegendItem>
            <S.LegendItem>
              <S.LegendDot $color="#CD0B16" />
              <span>포화 / 수용 불가</span>
            </S.LegendItem>
          </S.StatusLegend>

          <S.EmergencyRoomList>
            {emergencyRooms.map((room) => (
              <S.EmergencyRoomCard 
                key={room.id}
                onClick={() => navigate(`/main/emergency-room/${room.id}`)}
              >
                <S.RoomHeader>
                  <S.RoomName>{room.name}</S.RoomName>
                  <S.StatusBadge $color={getStatusColor(room.status)}>
                    <S.StatusDot $color={getStatusColor(room.status)} />
                    {getStatusText(room.status)}
                    {room.status !== 'full' && ` (대기 ${room.waiting}명)`}
                  </S.StatusBadge>
                </S.RoomHeader>
                <S.RoomAddress>{room.address}</S.RoomAddress>
                {room.hours && <S.RoomHours>{room.hours}</S.RoomHours>}
                <S.RoomDistance>
                  {room.distance} {room.time}
                </S.RoomDistance>
                <S.RoomSpecialties>
                  {room.specialties.map((specialty, idx) => (
                    <S.SpecialtyTag key={idx}>{specialty}</S.SpecialtyTag>
                  ))}
                </S.RoomSpecialties>
              </S.EmergencyRoomCard>
            ))}
          </S.EmergencyRoomList>

          <S.Disclaimer>
            ※ 실제 혼잡도 및 수용 가능 여부는 각 병원과의 연동 데이터 기준입니다.
          </S.Disclaimer>
          <S.UpdateLink>응급실 정보 업데이트 기준 보기</S.UpdateLink>
          <S.HelpButton onClick={() => navigate('/main/help')}>
            도움말
          </S.HelpButton>
        </S.InfoPanel>
      </S.MainContent>
      <PatientAlertButton />
    </S.Container>
  );
};

export default MapContainer;

