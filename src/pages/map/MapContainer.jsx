import React, { useEffect, useState } from 'react';
import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk';
import { useNavigate } from 'react-router-dom';
import PatientAlertButton from '../../components/patientAlert/PatientAlertButton';
import UserHeader from '../../components/header/UserHeader';
import * as S from './style';

const MapContainer = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('distance');
  const [location, setLocation] = useState(null);   
  const [map, setMap] = useState(null);
  const [myLocation, setMyLocation] = useState(null);

  const [center, setCenter] = useState({
    lat: 37.5665,   
    lng: 126.9780,
  });

  const [loading, error] = useKakaoLoader({
    appkey: process.env.REACT_APP_KAKAO_KEY, 
    libraries: ['services'], 
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      console.log('geolocation 지원 안 함');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCenter({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        console.log('위치 받기 실패', err);
        // 실패하면 기본 서울 좌표 유지
      }
    );
  }, []);


  const kakaoMap = () => {
    if (!location) return;
    if (!window.kakao) {
      console.log('kakao 객체가 아직 없음');
      return;
    }

    const container = document.getElementById('map');
    if (!container) return;

    const { kakao } = window;

    const options = {
      center: new kakao.maps.LatLng(location.latitude, location.longitude),
      level: 3,
    };

    const createdMap = new kakao.maps.Map(container, options);
    setMap(createdMap);
  };

  useEffect(() => {
    kakaoMap();
    console.log('현재 위치:', location);
  }, [location]);


  const CurrentLocationMarker = ({ map, location }) => {
    useEffect(() => {
      if (!map || !location || !window.kakao) return;

      const { kakao } = window;

      const position = new kakao.maps.LatLng(
        location.latitude,
        location.longitude
      );

      const marker = new kakao.maps.Marker({
        position,
      });

      marker.setMap(map);

      // cleanup
      return () => {
        marker.setMap(null);
      };
    }, [map, location]);

    return null; 
  };

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
      specialties: ['뇌·심혈관 전문', '중증 응급 수용 가능'],
    },
    {
      id: 2,
      name: '역삼성모병원 응급실',
      address: '서울 강남구 역삼로 45, 역삼성모병원 본관 지하 1층',
      distance: '1.4 km',
      time: '차량 5분',
      status: 'available',
      waiting: 3,
      specialties: ['소아 응급 가능', '구급차 우선'],
    },
    {
      id: 3,
      name: '한빛대학교병원 응급센터',
      address: '서울 서초구 서초대로 201, 한빛의료타워 1층 응급의료센터',
      distance: '2.7 km',
      time: '차량 10분',
      status: 'full',
      waiting: 0,
      specialties: ['중증외상센터', 'ICU 만실'],
    },
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

  const getMyLocation = () => {
    if (!navigator.geolocation) {
      alert("위치 정보를 지원하지 않는 브라우저입니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        const next = { lat: latitude, lng: longitude };

        setCenter(next);        
        setMyLocation(next);    

        console.log("현재위치", latitude, longitude);
      },
      (error) => {
        console.error("위치 가져오기 실패", error);
      },
      { enableHighAccuracy: true }
    );
  };


  const handleRelocate = () => {
    getMyLocation();
    console.log('위치 재탐색');
  };

  const handleNearestRoute = () => {
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
            {loading && <div>지도를 불러오는 중입니다...</div>}
            {error && <div>지도를 불러오는데 실패했습니다.</div>}
            {!loading && !error && (
              <Map
                center={center}
                style={{ width: '100%', height: '100%' }}
                level={3}
              >
                <MapMarker position={center} />
              </Map>
            )}
          </S.MapPlaceholder>
        </S.MapArea>

        <S.InfoPanel>
          <S.PanelHeader>
            <S.PanelTitle>주변 응급실</S.PanelTitle>
            <S.FilterInfo>반경 약 5km 내 응급의료기관 기준</S.FilterInfo>
            <S.SortSelect
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
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
