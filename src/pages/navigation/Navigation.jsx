import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserHeader from '../../components/header/UserHeader';
import * as S from './style';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:10000';

const Navigation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentAddress, setCurrentAddress] = useState('위치 정보를 가져오는 중...');
  const [routeType, setRouteType] = useState('driving'); // 'walking' or 'driving'
  const [directions, setDirections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [kakaoLoaded, setKakaoLoaded] = useState(false);

  // 현재 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('위치 정보를 가져올 수 없습니다:', error);
          // 기본 위치 (강남구)
          setCurrentLocation({
            lat: 37.4979,
            lng: 127.0276
          });
        }
      );
    } else {
      // 기본 위치 (강남구)
      setCurrentLocation({
        lat: 37.4979,
        lng: 127.0276
      });
    }
  }, []);

  // 카카오맵 SDK 로드 확인
  useEffect(() => {
    const checkKakaoLoaded = () => {
      if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
        setKakaoLoaded(true);
        return true;
      }
      return false;
    };

    if (checkKakaoLoaded()) {
      return;
    }

    // SDK가 아직 로드되지 않았다면 주기적으로 확인
    const interval = setInterval(() => {
      if (checkKakaoLoaded()) {
        clearInterval(interval);
      }
    }, 100);

    // 5초 후 타임아웃
    setTimeout(() => {
      clearInterval(interval);
      if (!checkKakaoLoaded()) {
        console.error('카카오맵 SDK 로드 실패');
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // API에서 응급실 정보 가져오기 (id가 있으면 해당 병원, 없으면 가장 가까운 병원)
  useEffect(() => {
    if (!currentLocation) return;

    const fetchEmergencyRoom = async () => {
      try {
        setLoading(true);
        
        // id가 있으면 해당 병원 찾기, 없으면 가장 가까운 병원 찾기
        const response = await fetch(
          `${BACKEND_URL}/api/emergency/search-emergency?lat=${currentLocation.lat}&lon=${currentLocation.lng}&pageNo=1&numOfRows=100`
        );
        
        if (!response.ok) {
          throw new Error('응급실 정보를 가져오는데 실패했습니다.');
        }

        const data = await response.json();
        
        // API 응답 구조: data.body.items
        const items = data?.data?.body?.items || data?.body?.items || [];
        
        if (items.length === 0) {
          throw new Error('주변 응급실을 찾을 수 없습니다.');
        }

        let targetRoom = null;

        // id가 있으면 해당 병원 찾기
        if (id) {
          targetRoom = items.find(item => item.hpid === id);
          if (!targetRoom) {
            throw new Error('해당 병원을 찾을 수 없습니다.');
          }
        } else {
          // id가 없으면 distance 기준으로 정렬하여 가장 가까운 병원 선택
          const sortedItems = [...items].sort((a, b) => {
            const distA = parseFloat(a.distance || 0);
            const distB = parseFloat(b.distance || 0);
            return distA - distB;
          });
          targetRoom = sortedItems[0];
        }

        if (targetRoom) {
          const latitude = parseFloat(targetRoom.latitude || targetRoom.wgs84Lat || '0');
          const longitude = parseFloat(targetRoom.longitude || targetRoom.wgs84Lon || '0');
          
          // 거리 계산 (현재 위치와 목적지 간)
          const calculateDistance = (lat1, lon1, lat2, lon2) => {
            const R = 6371; // 지구 반지름 (km)
            const dLat = ((lat2 - lat1) * Math.PI) / 180;
            const dLon = ((lon2 - lon1) * Math.PI) / 180;
            const a =
              Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos((lat1 * Math.PI) / 180) *
                Math.cos((lat2 * Math.PI) / 180) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
          };

          const distanceKm = targetRoom.distance 
            ? parseFloat(targetRoom.distance) 
            : calculateDistance(currentLocation.lat, currentLocation.lng, latitude, longitude);
          
          const distanceText = distanceKm < 1 
            ? `${Math.round(distanceKm * 1000)}m` 
            : `${distanceKm.toFixed(2)} km`;

          setRouteInfo({
            name: targetRoom.dutyName || '응급실',
            address: targetRoom.dutyAddr || '',
            lat: latitude,
            lng: longitude,
            distance: distanceText,
            time: distanceKm < 1 ? '도보 약 5분' : distanceKm < 3 ? '도보 약 10분' : '도보 약 20분',
            carTime: distanceKm < 1 ? '차량 약 3분' : distanceKm < 3 ? '차량 약 5분' : '차량 약 10분'
          });
        } else {
          throw new Error('응급실 위치 정보가 없습니다.');
        }
      } catch (error) {
        console.error('응급실 정보 조회 오류:', error);
        alert(error.message || '응급실 정보를 가져오는데 실패했습니다. 다시 시도해주세요.');
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchEmergencyRoom();
  }, [currentLocation, id, navigate]);

  // 좌표를 주소로 변환 (역지오코딩)
  const getAddressFromCoords = (lat, lng) => {
    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
      return;
    }

    const geocoder = new window.kakao.maps.services.Geocoder();
    const coord = new window.kakao.maps.LatLng(lat, lng);

    geocoder.coord2Address(coord.getLng(), coord.getLat(), (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const address = result[0];
        let addressName = '';
        
        // 도로명 주소가 있으면 도로명 주소 사용, 없으면 지번 주소 사용
        if (address.road_address) {
          addressName = address.road_address.address_name;
        } else if (address.address) {
          addressName = address.address.address_name;
        }
        
        if (addressName) {
          // "서울특별시 강남구 역삼동" 형식에서 "서울 강남구 역삼동 근처" 형식으로 변환
          const formattedAddress = addressName
            .replace('서울특별시', '서울')
            .replace('광역시', '')
            .replace('특별시', '')
            .replace('특별자치시', '')
            .replace('특별자치도', '');
          
          setCurrentAddress(formattedAddress);
        } else {
          setCurrentAddress('주소를 가져올 수 없습니다.');
        }
      } else {
        setCurrentAddress('주소를 가져올 수 없습니다.');
      }
    });
  };

  // currentLocation이 변경될 때마다 주소 업데이트
  useEffect(() => {
    if (currentLocation && currentLocation.lat && currentLocation.lng && kakaoLoaded) {
      getAddressFromCoords(currentLocation.lat, currentLocation.lng);
    }
  }, [currentLocation, kakaoLoaded]);

  // 지도 및 경로 표시
  useEffect(() => {
    if (!kakaoLoaded || !currentLocation || !routeInfo) return;

    const { kakao } = window;
    const container = mapRef.current;
    if (!container) return;

    // 기존 지도가 있으면 제거
    if (mapInstanceRef.current) {
      // 지도 인스턴스는 재사용 가능하므로 업데이트만 수행
    } else {
      // 지도 생성
      mapInstanceRef.current = new kakao.maps.Map(container, {
        center: new kakao.maps.LatLng(currentLocation.lat, currentLocation.lng),
        level: 4
      });
    }

    const map = mapInstanceRef.current;

    // 기존 마커 제거 (간단하게 지도 중심과 레벨만 업데이트)
    // 마커는 매번 새로 생성
    const startMarker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(currentLocation.lat, currentLocation.lng),
      map: map
    });

    const startInfoWindow = new kakao.maps.InfoWindow({
      content: `<div style="padding:8px 12px;font-size:13px;font-weight:bold;min-width:80px;max-width:250px;word-wrap:break-word;white-space:normal;line-height:1.4;text-align:center;">${currentAddress}</div>`,
      removable: true
    });
    startInfoWindow.open(map, startMarker);

    const endMarker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(routeInfo.lat, routeInfo.lng),
      map: map
    });

    const endInfoWindow = new kakao.maps.InfoWindow({
      content: `<div style="padding:8px 12px;font-size:13px;font-weight:bold;min-width:80px;max-width:250px;word-wrap:break-word;white-space:normal;line-height:1.4;text-align:center;">${routeInfo.name}</div>`,
      removable: true
    });
    endInfoWindow.open(map, endMarker);

    // Directions 서비스 사용 전 확인
    if (!kakao.maps.services || !kakao.maps.services.Directions) {
      console.warn('카카오맵 Directions 서비스를 사용할 수 없습니다. 마커만 표시합니다.');
      // 지도 범위 조정
      const bounds = new kakao.maps.LatLngBounds();
      bounds.extend(new kakao.maps.LatLng(currentLocation.lat, currentLocation.lng));
      bounds.extend(new kakao.maps.LatLng(routeInfo.lat, routeInfo.lng));
      map.setBounds(bounds);
      return;
    }

    // 경로 그리기
    try {
      const directionsService = new kakao.maps.services.Directions();
      const start = new kakao.maps.LatLng(currentLocation.lat, currentLocation.lng);
      const end = new kakao.maps.LatLng(routeInfo.lat, routeInfo.lng);

      // 경로 검색
      directionsService.route({
        origin: start,
        destination: end,
        priority: kakao.maps.services.RoutePriority.SHORTEST
      }, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          // 경로 정보
          const route = result.routes[0];
          
          // 경로 안내 정보 추출
          const guideSteps = [];
          if (route && route.sections) {
            route.sections.forEach((section) => {
              if (section.roads) {
                section.roads.forEach((road) => {
                  if (road.name) {
                    guideSteps.push({
                      instructions: road.name,
                      distance: road.distance
                    });
                  }
                });
              }
            });
          }
          setDirections(guideSteps);

          // 경로 선 그리기
          const linePath = [];
          if (route && route.sections) {
            route.sections.forEach((section) => {
              if (section.roads) {
                section.roads.forEach((road) => {
                  if (road.vertexes && road.vertexes.length > 0) {
                    for (let i = 0; i < road.vertexes.length; i += 2) {
                      if (i + 1 < road.vertexes.length) {
                        linePath.push(
                          new kakao.maps.LatLng(road.vertexes[i], road.vertexes[i + 1])
                        );
                      }
                    }
                  }
                });
              }
            });
          }

          if (linePath.length > 0) {
            const polyline = new kakao.maps.Polyline({
              path: linePath,
              strokeWeight: 5,
              strokeColor: '#CD0B16',
              strokeOpacity: 0.7,
              strokeStyle: 'solid'
            });

            polyline.setMap(map);
          }

          // 지도 범위 조정
          const bounds = new kakao.maps.LatLngBounds();
          bounds.extend(start);
          bounds.extend(end);
          map.setBounds(bounds);
        } else {
          console.error('경로를 찾을 수 없습니다:', status);
          // 경로를 찾을 수 없어도 마커는 표시
          const bounds = new kakao.maps.LatLngBounds();
          bounds.extend(start);
          bounds.extend(end);
          map.setBounds(bounds);
        }
      });
    } catch (error) {
      console.error('경로 검색 오류:', error);
      // 에러 발생 시에도 마커는 표시
      const bounds = new kakao.maps.LatLngBounds();
      bounds.extend(new kakao.maps.LatLng(currentLocation.lat, currentLocation.lng));
      bounds.extend(new kakao.maps.LatLng(routeInfo.lat, routeInfo.lng));
      map.setBounds(bounds);
    }
  }, [kakaoLoaded, currentLocation, routeInfo, routeType]);

  const handleStartKakaoNavigation = () => {
    if (!routeInfo) return;
    
    // 카카오맵 앱으로 네비게이션 시작
    const url = `https://map.kakao.com/link/to/${encodeURIComponent(routeInfo.name)},${routeInfo.lat},${routeInfo.lng}`;
    window.open(url, '_blank');
  };

  const handleStartKakaoMap = () => {
    if (!routeInfo || !currentLocation) return;
    
    // 카카오맵 웹에서 길찾기
    const url = `https://map.kakao.com/link/roadview/${routeInfo.lat},${routeInfo.lng}`;
    window.open(url, '_blank');
  };

  if (loading || !routeInfo) {
    return (
      <S.Container>
        <S.Loading>로딩 중...</S.Loading>
      </S.Container>
    );
  }

  return (
    <S.Container>
      <UserHeader />
      <S.Header>
        <S.HeaderContent>
          <S.BackButton onClick={() => navigate(-1)}>← 뒤로</S.BackButton>
          <S.Title>네비게이션</S.Title>
        </S.HeaderContent>
      </S.Header>

      <S.MainContent>
        <S.MainContentWrapper>
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
              $active={routeType === 'walking'}
              onClick={() => setRouteType('walking')}
            >
              🚶 도보
            </S.ToggleButton>
            <S.ToggleButton
              $active={routeType === 'driving'}
              onClick={() => setRouteType('driving')}
            >
              🚗 차량
            </S.ToggleButton>
          </S.RouteToggle>

          <S.RouteDetails>
            <S.RouteItem>
              <S.RouteLabel>출발지</S.RouteLabel>
              <S.RouteValue>{currentAddress}</S.RouteValue>
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
                {routeType === 'walking' ? routeInfo.time : routeInfo.carTime}
              </S.RouteValue>
            </S.RouteItem>
          </S.RouteDetails>
        </S.RouteInfo>

        <S.MapContainer ref={mapRef} />

        {directions.length > 0 && (
          <S.DirectionsList>
            <S.DirectionsTitle>경로 안내</S.DirectionsTitle>
            {directions.slice(0, 5).map((direction, index) => (
              <S.DirectionItem key={index}>
                <S.DirectionNumber>{index + 1}</S.DirectionNumber>
                <S.DirectionText>{direction.instructions || direction.roadName}</S.DirectionText>
              </S.DirectionItem>
            ))}
          </S.DirectionsList>
        )}
          </S.Content>
        </S.MainContentWrapper>
      </S.MainContent>

      <S.ActionButtons>
        <S.ActionButtonsContent>
          <S.PrimaryButton onClick={handleStartKakaoNavigation}>
            카카오맵 앱으로 네비게이션
          </S.PrimaryButton>
          <S.SecondaryButton onClick={handleStartKakaoMap}>
            카카오맵 웹에서 보기
          </S.SecondaryButton>
        </S.ActionButtonsContent>
      </S.ActionButtons>
    </S.Container>
  );
};

export default Navigation;
