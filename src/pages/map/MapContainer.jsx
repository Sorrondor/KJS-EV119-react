import React, { useEffect, useState, useRef } from 'react';
import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk';
import { useNavigate } from 'react-router-dom';
import PatientAlertButton from '../../components/patientAlert/PatientAlertButton';
import UserHeader from '../../components/header/UserHeader';
import * as S from './style';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:10000';

const MapContainer = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('distance');
  const [currentPage, setCurrentPage] = useState(1);
  const [location, setLocation] = useState(null);   
  const [map, setMap] = useState(null);
  const [emergencyRooms, setEmergencyRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const mapInstanceRef = useRef(null);
  const isInitialZoomSet = useRef(false);
  
  const ITEMS_PER_PAGE = 4;

  const [myLocation, setMyLocation] = useState(null);


  const [center, setCenter] = useState({
    lat: 37.5665,   
    lng: 126.9780,
  });

  const [kakaoLoading, error] = useKakaoLoader({
    appkey: process.env.REACT_APP_KAKAO_KEY, 
    libraries: ['services'], 
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      console.log('geolocation 지원 안 함');
      return;
    }

    let watchId = null;
    let positionCount = 0;
    let bestPosition = null;
    let bestAccuracy = Infinity;

    // watchPosition으로 지속적으로 위치 업데이트하여 가장 정확한 위치 찾기
    watchId = navigator.geolocation.watchPosition(
      (pos) => {
        positionCount++;
        const accuracy = pos.coords.accuracy; // 미터 단위 정확도
        console.log(`위치 업데이트 #${positionCount}:`, {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: `${accuracy.toFixed(0)}m`,
          altitude: pos.coords.altitude,
          altitudeAccuracy: pos.coords.altitudeAccuracy,
          heading: pos.coords.heading,
          speed: pos.coords.speed
        });

        // 더 정확한 위치를 찾으면 업데이트
        if (accuracy < bestAccuracy) {
          bestAccuracy = accuracy;
          bestPosition = pos;
          
          const newCenter = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          
          console.log('더 정확한 위치 발견:', newCenter, `정확도: ${accuracy.toFixed(0)}m`);
          setCenter(newCenter);
          
          // 지도가 이미 생성되어 있으면 중심 이동
          if (mapInstanceRef.current && window.kakao && window.kakao.maps) {
            const { kakao } = window;
            const map = mapInstanceRef.current;
            const moveLatLon = new kakao.maps.LatLng(newCenter.lat, newCenter.lng);
            map.setCenter(moveLatLon);
          }
          
          // 정확도가 50m 이하이거나 5번 이상 업데이트되면 watchPosition 중지
          if (accuracy <= 50 || positionCount >= 5) {
            if (watchId !== null) {
              navigator.geolocation.clearWatch(watchId);
              watchId = null;
              console.log('위치 추적 중지. 최종 위치:', newCenter, `정확도: ${accuracy.toFixed(0)}m`);
              
              // 최종 위치로 응급실 정보 가져오기
              fetchEmergencyRooms(newCenter.lat, newCenter.lng);
            }
          }
        }
      },
      (err) => {
        console.log('위치 받기 실패', err);
        if (watchId !== null) {
          navigator.geolocation.clearWatch(watchId);
        }
        
        // 실패하면 기본 서울 좌표로 응급실 정보 가져오기
        if (!bestPosition) {
          fetchEmergencyRooms(37.5665, 126.9780);
        }
      },
      {
        enableHighAccuracy: true, // 높은 정확도 사용 (GPS 우선)
        timeout: 15000, // 15초 타임아웃
        maximumAge: 0 // 캐시 사용 안 함
      }
    );

    // 10초 후 강제로 중지 (너무 오래 걸리지 않도록)
    const timeoutId = setTimeout(() => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
        
        if (bestPosition) {
          const finalCenter = {
            lat: bestPosition.coords.latitude,
            lng: bestPosition.coords.longitude,
          };
          console.log('타임아웃. 최종 위치:', finalCenter);
          fetchEmergencyRooms(finalCenter.lat, finalCenter.lng);
        } else {
          fetchEmergencyRooms(37.5665, 126.9780);
        }
      }
    }, 10000);

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
      clearTimeout(timeoutId);
    };
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

  // 백엔드 API로 응급의료기관 위치정보 조회
  const fetchEmergencyRooms = async (lat, lng) => {
    try {
      setLoading(true);
      setApiError(null);

      // 백엔드 API 호출: 현재 위치 기반으로 응급실 검색
      const url = `${BACKEND_URL}/api/emergency/search-emergency?lat=${lat}&lon=${lng}&pageNo=1&numOfRows=30`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API 호출 실패: ${response.status}`);
      }

      const data = await response.json();
      
      // API 응답 구조: data.body.items 또는 data.data.body.items
      const items = data?.data?.body?.items || data?.body?.items || data?.items || [];
      
      if (items.length === 0) {
        setApiError('주변 응급실을 찾을 수 없습니다.');
        setLoading(false);
        return;
      }

      const rooms = items.map((item, index) => {
        const dutyName = item.dutyName || '';
        const dutyAddr = item.dutyAddr || '';
        const latitude = parseFloat(item.latitude || item.wgs84Lat || '0');
        const longitude = parseFloat(item.longitude || item.wgs84Lon || '0');
        const hpid = item.hpid || '';
        const dutyTel1 = item.dutyTel1 || '';
        const dutyTel3 = item.dutyTel3 || '';
        const distance = parseFloat(item.distance || '0');
        const dutyDivName = item.dutyDivName || '';
        const dutyEmclsName = item.dutyEmclsName || '';
        const hvec = parseInt(item.hvec || '0'); // 응급실 병상
        const hvgc = parseInt(item.hvgc || '0'); // 입원실 병상
        
        // 거리 계산 (km)
        const distanceKm = distance > 0 ? distance : calculateDistance(lat, lng, latitude, longitude);
        const distanceText = distanceKm < 1 
          ? `${Math.round(distanceKm * 1000)}m` 
          : `${distanceKm.toFixed(1)} km`;
        
        // 병상 정보로 상태 결정
        let status = 'available';
        let waiting = 0;

        if (hvec === 0) {
          status = 'full';
        } else if (hvec < 5) {
          status = 'crowded';
          waiting = 10;
        } else if (hvec < 10) {
          status = 'crowded';
          waiting = 5;
        }
        
        return {
          id: hpid || `room-${index}`,
          hpid: hpid,
          name: dutyName,
          address: dutyAddr,
          lat: latitude,
          lng: longitude,
          distance: distanceText,
          distanceValue: distanceKm,
          time: distanceKm < 1 ? '도보 약 5분' : distanceKm < 3 ? '차량 약 10분' : '차량 약 20분',
          phone: dutyTel3 || dutyTel1,
          status: status,
          waiting: waiting,
          specialties: dutyEmclsName ? [dutyEmclsName] : dutyDivName ? [dutyDivName] : [],
          hours: '24시간 응급실 운영',
        };
      });

      // 거리순 정렬
      rooms.sort((a, b) => a.distanceValue - b.distanceValue);
      
      setEmergencyRooms(rooms);
      
      // 지도 범위 조정을 위한 플래그 리셋 (새로운 데이터 로드 시)
      isInitialZoomSet.current = false;
    } catch (error) {
      console.error('응급실 정보 조회 실패:', error);
      setApiError(error.message || '응급실 정보를 가져오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 두 좌표 간 거리 계산 (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // 지구 반지름 (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // 지도가 생성된 후 center가 변경되면 지도 중심 업데이트
  useEffect(() => {
    if (!mapInstanceRef.current || !window.kakao || !window.kakao.maps) return;
    if (!center.lat || !center.lng) return;

    const { kakao } = window;
    const map = mapInstanceRef.current;
    const moveLatLon = new kakao.maps.LatLng(center.lat, center.lng);
    map.setCenter(moveLatLon);
  }, [center]);

  // 지도 범위 조정: 현재 위치와 가장 가까운 병원을 포함하도록
  useEffect(() => {
    if (!mapInstanceRef.current || !window.kakao || !window.kakao.maps) return;
    if (isInitialZoomSet.current) return; // 이미 설정했으면 스킵
    if (emergencyRooms.length === 0 || !center.lat || !center.lng) return;

    const { kakao } = window;
    const map = mapInstanceRef.current;

    // 가장 가까운 병원 찾기 (이미 거리순으로 정렬되어 있음)
    const nearestRoom = emergencyRooms[0];
    if (!nearestRoom || !nearestRoom.lat || !nearestRoom.lng) return;

    // 약간의 지연을 두어 지도가 완전히 렌더링된 후 실행
    setTimeout(() => {
      // 현재 위치와 가장 가까운 병원을 포함하는 범위 설정
      const bounds = new kakao.maps.LatLngBounds();
      
      // 현재 위치 추가
      bounds.extend(new kakao.maps.LatLng(center.lat, center.lng));
      
      // 가장 가까운 병원 추가
      bounds.extend(new kakao.maps.LatLng(nearestRoom.lat, nearestRoom.lng));
      
      // 범위를 지도에 적용 (패딩 추가)
      map.setBounds(bounds, 100); // 100px 패딩
      
      // 초기 줌 설정 완료
      isInitialZoomSet.current = true;
    }, 100);
  }, [emergencyRooms, center]);

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

  const handleNearestRoute = () => {
    if (emergencyRooms.length === 0) return;
    
    const nearestRoom = emergencyRooms[0]; // 이미 거리순으로 정렬됨
    if (nearestRoom) {
      navigate(`/main/navigation/${nearestRoom.hpid || nearestRoom.id}`);
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

    // 위치 재탐색 시 더 정확한 위치를 얻기 위해 watchPosition 사용
    let watchId = null;
    let positionCount = 0;
    let bestPosition = null;
    let bestAccuracy = Infinity;

    watchId = navigator.geolocation.watchPosition(
      (pos) => {
        positionCount++;
        const accuracy = pos.coords.accuracy;
        console.log(`위치 재탐색 #${positionCount}:`, {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: `${accuracy.toFixed(0)}m`
        });

        // 더 정확한 위치를 찾으면 업데이트
        if (accuracy < bestAccuracy) {
          bestAccuracy = accuracy;
          bestPosition = pos;
          
          const newCenter = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          
          setCenter(newCenter);
          
          // 지도 중심을 현재 위치로 이동
          if (mapInstanceRef.current && window.kakao && window.kakao.maps) {
            const { kakao } = window;
            const map = mapInstanceRef.current;
            const moveLatLon = new kakao.maps.LatLng(newCenter.lat, newCenter.lng);
            map.setCenter(moveLatLon);
            map.setLevel(3); // 줌 레벨 조정
          }
          
          // 정확도가 50m 이하이거나 3번 이상 업데이트되면 중지
          if (accuracy <= 50 || positionCount >= 3) {
            if (watchId !== null) {
              navigator.geolocation.clearWatch(watchId);
              watchId = null;
              console.log('위치 재탐색 완료:', newCenter, `정확도: ${accuracy.toFixed(0)}m`);
              fetchEmergencyRooms(newCenter.lat, newCenter.lng);
            }
          }
        }
      },
      (err) => {
        console.log('위치 재탐색 실패', err);
        if (watchId !== null) {
          navigator.geolocation.clearWatch(watchId);
        }
        alert('위치를 다시 가져오는데 실패했습니다.');
      },
      {
        enableHighAccuracy: true, // 높은 정확도 사용 (GPS 우선)
        timeout: 15000, // 15초 타임아웃
        maximumAge: 0 // 캐시 사용 안 함
      }
    );

    // 8초 후 강제로 중지
    setTimeout(() => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        if (bestPosition) {
          const finalCenter = {
            lat: bestPosition.coords.latitude,
            lng: bestPosition.coords.longitude,
          };
          fetchEmergencyRooms(finalCenter.lat, finalCenter.lng);
        }
      }
    }, 8000);
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
            {kakaoLoading && <div>지도를 불러오는 중입니다...</div>}
            {error && <div>지도를 불러오는데 실패했습니다.</div>}
            {!kakaoLoading && !error && (
              <Map
                center={center}
                style={{ width: '100%', height: '100%', minHeight: '100%' }}
                level={3}
                isPanto={true}
                onCreate={(map) => {
                  mapInstanceRef.current = map;
                  // 지도 생성 시 현재 위치로 중심 설정
                  if (center.lat && center.lng && window.kakao && window.kakao.maps) {
                    const { kakao } = window;
                    const moveLatLon = new kakao.maps.LatLng(center.lat, center.lng);
                    map.setCenter(moveLatLon);
                  }
                }}
              >
                {/* 현재 위치 마커 */}
                <MapMarker 
                  position={center}
                />
                
                {/* 병원 위치 마커들 */}
                {emergencyRooms.map((room) => {
                  if (!room.lat || !room.lng) return null;
                  
                  return (
                    <MapMarker
                      key={room.id}
                      position={{ lat: room.lat, lng: room.lng }}
                      clickable={true}
                      onClick={() => navigate(`/main/emergency-room/${room.hpid || room.id}`)}
                      title={room.name}
                    />
                  );
                })}
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
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1); // 정렬 변경 시 첫 페이지로
              }}
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

          {loading && (
            <S.LoadingMessage>응급실 정보를 불러오는 중...</S.LoadingMessage>
          )}
          {apiError && (
            <S.ErrorMessage>오류: {apiError}</S.ErrorMessage>
          )}
          {!loading && !apiError && emergencyRooms.length === 0 && (
            <S.EmptyMessage>주변 응급실을 찾을 수 없습니다.</S.EmptyMessage>
          )}
          {!loading && !apiError && emergencyRooms.length > 0 && (() => {
            // 정렬된 데이터
            const sortedRooms = [...emergencyRooms].sort((a, b) => {
              if (sortBy === 'distance') {
                return a.distanceValue - b.distanceValue;
              } else if (sortBy === 'status') {
                const statusOrder = { available: 1, crowded: 2, full: 3 };
                return statusOrder[a.status] - statusOrder[b.status];
              }
              return 0;
            });

            // 페이지네이션 계산
            const totalPages = Math.ceil(sortedRooms.length / ITEMS_PER_PAGE);
            const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
            const endIndex = startIndex + ITEMS_PER_PAGE;
            const paginatedRooms = sortedRooms.slice(startIndex, endIndex);

            return (
              <>
                <S.EmergencyRoomList>
                  {paginatedRooms.map((room) => (
                    <S.EmergencyRoomCard
                      key={room.id}
                      onClick={() => navigate(`/main/emergency-room/${room.hpid || room.id}`)}
                    >
                      <S.RoomHeader>
                        <S.RoomName>{room.name}</S.RoomName>
                        <S.StatusBadge $color={getStatusColor(room.status)}>
                          <S.StatusDot $color={getStatusColor(room.status)} />
                          {getStatusText(room.status)}
                          {room.status !== 'full' && room.waiting > 0 && ` (대기 ${room.waiting}명)`}
                        </S.StatusBadge>
                      </S.RoomHeader>
                      <S.RoomAddress>{room.address}</S.RoomAddress>
                      {room.hours && <S.RoomHours>{room.hours}</S.RoomHours>}
                      <S.RoomDistance>
                        {room.distance} {room.time}
                      </S.RoomDistance>
                      {room.phone && (
                        <S.RoomPhone>전화: {room.phone}</S.RoomPhone>
                      )}
                      {room.specialties && room.specialties.length > 0 && (
                        <S.RoomSpecialties>
                          {room.specialties.map((specialty, idx) => (
                            <S.SpecialtyTag key={idx}>{specialty}</S.SpecialtyTag>
                          ))}
                        </S.RoomSpecialties>
                      )}
                    </S.EmergencyRoomCard>
                  ))}
                </S.EmergencyRoomList>

                {/* 페이지네이션 */}
                {totalPages > 1 && (
                  <S.Pagination>
                    <S.PaginationButton
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      이전
                    </S.PaginationButton>
                    <S.PaginationInfo>
                      {currentPage} / {totalPages}
                    </S.PaginationInfo>
                    <S.PaginationButton
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      다음
                    </S.PaginationButton>
                  </S.Pagination>
                )}
              </>
            );
          })()}

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
