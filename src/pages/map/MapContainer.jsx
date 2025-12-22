import React, { useEffect, useState, useRef } from 'react';
import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk';
import { useNavigate } from 'react-router-dom';
import PatientAlertButton from '../../components/patientAlert/PatientAlertButton';
import UserHeader from '../../components/header/UserHeader';
import * as S from './style';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:10000';

// ✅ 숫자 파싱 유틸: 값이 없거나 공백이면 null 반환 (절대 0으로 강제하지 않음)
const toNumberOrNull = (value) => {
  if (value === undefined || value === null) return null;
  const str = String(value).trim();
  if (str === '') return null;
  const num = Number(str);
  return Number.isFinite(num) ? num : null;
};

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
  const [currentAddress, setCurrentAddress] = useState('위치 정보를 가져오는 중...');

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

    watchId = navigator.geolocation.watchPosition(
      (pos) => {
        positionCount++;
        const accuracy = pos.coords.accuracy;

        console.log(`위치 업데이트 #${positionCount}:`, {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: `${accuracy.toFixed(0)}m`,
          altitude: pos.coords.altitude,
          altitudeAccuracy: pos.coords.altitudeAccuracy,
          heading: pos.coords.heading,
          speed: pos.coords.speed,
        });

        if (accuracy < bestAccuracy) {
          bestAccuracy = accuracy;
          bestPosition = pos;

          const newCenter = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };

          console.log('더 정확한 위치 발견:', newCenter, `정확도: ${accuracy.toFixed(0)}m`);
          setCenter(newCenter);

          if (mapInstanceRef.current && window.kakao && window.kakao.maps) {
            const { kakao } = window;
            const map = mapInstanceRef.current;
            const moveLatLon = new kakao.maps.LatLng(newCenter.lat, newCenter.lng);
            map.setCenter(moveLatLon);
          }

          if (accuracy <= 50 || positionCount >= 5) {
            if (watchId !== null) {
              navigator.geolocation.clearWatch(watchId);
              watchId = null;

              console.log('위치 추적 중지. 최종 위치:', newCenter, `정확도: ${accuracy.toFixed(0)}m`);
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

        if (!bestPosition) {
          fetchEmergencyRooms(37.5665, 126.9780);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );

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

      const position = new kakao.maps.LatLng(location.latitude, location.longitude);

      const marker = new kakao.maps.Marker({
        position,
      });

      marker.setMap(map);

      return () => {
        marker.setMap(null);
      };
    }, [map, location]);

    return null;
  };

  
  const fetchEmergencyRooms = async (lat, lng) => {
    try {
      setLoading(true);
      setApiError(null);

      const url = `${BACKEND_URL}/api/emergency/search-emergency-with-status?lat=${lat}&lon=${lng}&pageNo=1&numOfRows=30`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API 호출 실패: ${response.status}`);
      }

      const data = await response.json();

      const items = data?.data?.body?.items || data?.body?.items || data?.items || [];

      if (items.length === 0) {
        setApiError('주변 응급실을 찾을 수 없습니다.');
        setLoading(false);
        return;
      }

      const rooms = items.map((item, index) => {
        const dutyName = item.dutyName || '';
        const dutyAddr = item.dutyAddr || '';
        const latitude = toNumberOrNull(item.latitude ?? item.wgs84Lat) ?? 0;
        const longitude = toNumberOrNull(item.longitude ?? item.wgs84Lon) ?? 0;
        const hpid = item.hpid || '';
        const dutyTel1 = item.dutyTel1 || '';
        const dutyTel3 = item.dutyTel3 || '';
        const distance = toNumberOrNull(item.distance) ?? 0;
        const dutyDivName = item.dutyDivName || '';
        const dutyEmclsName = item.dutyEmclsName || '';

       
        const hvec = toNumberOrNull(item.hvec); 
        const hvgc = toNumberOrNull(item.hvgc); 

       
        const distanceKm =
          distance > 0 ? distance : calculateDistance(lat, lng, latitude, longitude);
        const distanceText =
          distanceKm < 1 ? `${Math.round(distanceKm * 1000)}m` : `${distanceKm.toFixed(1)} km`;

        
        let status = 'unknown';
        let waiting = 0;

        if (hvec !== null) {
          if (hvec === 0) {
            status = 'full';
          } else if (hvec < 5) {
            status = 'crowded';
            waiting = 10;
          } else if (hvec < 10) {
            status = 'crowded';
            waiting = 5;
          } else {
            status = 'available';
          }
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
          status,
          waiting,
          specialties: dutyEmclsName ? [dutyEmclsName] : dutyDivName ? [dutyDivName] : [],
          hours: '24시간 응급실 운영',

          hvec,
          hvgc,
        };
      });

 
      rooms.sort((a, b) => a.distanceValue - b.distanceValue);

      setEmergencyRooms(rooms);

      isInitialZoomSet.current = false;
    } catch (error) {
      console.error('응급실 정보 조회 실패:', error);
      setApiError(error.message || '응급실 정보를 가져오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };


  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
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

        if (address.road_address) {
          addressName = address.road_address.address_name;
        } else if (address.address) {
          addressName = address.address.address_name;
        }

        if (addressName) {
          const formattedAddress = addressName
            .replace('서울특별시', '서울')
            .replace('광역시', '')
            .replace('특별시', '')
            .replace('특별자치시', '')
            .replace('특별자치도', '');

          setCurrentAddress(`${formattedAddress} 근처`);
        } else {
          setCurrentAddress('주소를 가져올 수 없습니다.');
        }
      } else {
        setCurrentAddress('주소를 가져올 수 없습니다.');
      }
    });
  };

  useEffect(() => {
    if (center.lat && center.lng && window.kakao && window.kakao.maps && window.kakao.maps.services) {
      getAddressFromCoords(center.lat, center.lng);
    }
  }, [center]);

  useEffect(() => {
    if (!mapInstanceRef.current || !window.kakao || !window.kakao.maps) return;
    if (!center.lat || !center.lng) return;

    const { kakao } = window;
    const map = mapInstanceRef.current;
    const moveLatLon = new kakao.maps.LatLng(center.lat, center.lng);
    map.setCenter(moveLatLon);
  }, [center]);

  useEffect(() => {
    if (!mapInstanceRef.current || !window.kakao || !window.kakao.maps) return;
    if (isInitialZoomSet.current) return;
    if (emergencyRooms.length === 0 || !center.lat || !center.lng) return;

    const { kakao } = window;
    const map = mapInstanceRef.current;

    const nearestRoom = emergencyRooms[0];
    if (!nearestRoom || !nearestRoom.lat || !nearestRoom.lng) return;

    setTimeout(() => {
      const bounds = new kakao.maps.LatLngBounds();

      bounds.extend(new kakao.maps.LatLng(center.lat, center.lng));
      bounds.extend(new kakao.maps.LatLng(nearestRoom.lat, nearestRoom.lng));

      map.setBounds(bounds, 100);

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
      case 'unknown':
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
      case 'unknown':
      default:
        return '정보없음';
    }
  };

  // 상태에 따른 커스텀 마커 이미지 생성 (기본 마커와 동일한 모양, 색상만 변경)
  const getCustomMarkerImage = (color) => {
    const size = { width: 24, height: 35 };
    // 카카오맵 기본 마커와 동일한 모양의 SVG (핀 모양)
    const svg = `
      <svg width="${size.width}" height="${size.height}" viewBox="0 0 24 35" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.4 0 0 5.4 0 12c0 8.4 12 23 12 23s12-14.6 12-23C24 5.4 18.6 0 12 0z" fill="${color}" stroke="#FFFFFF" stroke-width="1"/>
        <circle cx="12" cy="12" r="5" fill="#FFFFFF"/>
      </svg>
    `;
    // SVG를 data URL로 변환
    const encodedSvg = encodeURIComponent(svg);
    return `data:image/svg+xml,${encodedSvg}`;
  };

  const performSearch = async () => {
    if (!searchTerm.trim()) return;

    const searchQuery = searchTerm.trim();
    setLoading(true);
    setApiError(null);

    try {
      const matchedHospital = emergencyRooms.find(
        (room) => room.name.includes(searchQuery) || room.address.includes(searchQuery)
      );

      if (matchedHospital) {
        const newCenter = { lat: matchedHospital.lat, lng: matchedHospital.lng };
        setCenter(newCenter);

        if (mapInstanceRef.current && window.kakao && window.kakao.maps) {
          const { kakao } = window;
          const map = mapInstanceRef.current;
          const moveLatLon = new kakao.maps.LatLng(newCenter.lat, newCenter.lng);
          map.setCenter(moveLatLon);
          map.setLevel(3);
        }

        setLoading(false);
        return;
      }

      if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
        throw new Error('카카오맵 서비스를 사용할 수 없습니다.');
      }

      const places = new window.kakao.maps.services.Places();

      places.keywordSearch(searchQuery, (data, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          if (data && data.length > 0) {
            const firstResult = data[0];
            const newCenter = {
              lat: parseFloat(firstResult.y),
              lng: parseFloat(firstResult.x),
            };

            setCenter(newCenter);

            if (mapInstanceRef.current && window.kakao && window.kakao.maps) {
              const { kakao } = window;
              const map = mapInstanceRef.current;
              const moveLatLon = new kakao.maps.LatLng(newCenter.lat, newCenter.lng);
              map.setCenter(moveLatLon);
              map.setLevel(3);
            }

            fetchEmergencyRooms(newCenter.lat, newCenter.lng);
          } else {
            setApiError(`"${searchQuery}"에 대한 검색 결과가 없습니다.`);
            setLoading(false);
          }
        } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
          setApiError(`"${searchQuery}"에 대한 검색 결과가 없습니다.`);
          setLoading(false);
        } else {
          setApiError('검색 중 오류가 발생했습니다.');
          setLoading(false);
        }
      });
    } catch (error) {
      console.error('검색 오류:', error);
      setApiError(error.message || '검색 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  };

  const handleNearestRoute = () => {
    if (emergencyRooms.length === 0) return;

    const nearestRoom = emergencyRooms[0];
    if (nearestRoom) {
      navigate(`/main/navigation/${nearestRoom.hpid || nearestRoom.id}`);
    }
  };

  const getMyLocation = () => {
    if (!navigator.geolocation) {
      alert('위치 정보를 지원하지 않는 브라우저입니다.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        const next = { lat: latitude, lng: longitude };

        setCenter(next);
        setMyLocation(next);

        console.log('현재위치', latitude, longitude);
      },
      (error) => {
        console.error('위치 가져오기 실패', error);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleRelocate = () => {
    getMyLocation();
    console.log('위치 재탐색');

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
          accuracy: `${accuracy.toFixed(0)}m`,
        });

        if (accuracy < bestAccuracy) {
          bestAccuracy = accuracy;
          bestPosition = pos;

          const newCenter = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };

          setCenter(newCenter);

          if (mapInstanceRef.current && window.kakao && window.kakao.maps) {
            const { kakao } = window;
            const map = mapInstanceRef.current;
            const moveLatLon = new kakao.maps.LatLng(newCenter.lat, newCenter.lng);
            map.setCenter(moveLatLon);
            map.setLevel(3);
          }

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
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );

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
          <span>현재 위치: {currentAddress}</span>
        </S.LocationInfo>
        <S.HeaderControls>
          <S.SearchContainer>
            <S.SearchInput
              type="text"
              placeholder="지역·병원명으로 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleSearch}
            />
            <S.SearchButton onClick={performSearch} disabled={loading || !searchTerm.trim()}>
              검색
            </S.SearchButton>
          </S.SearchContainer>
          <S.RelocateButton onClick={handleRelocate}>내 위치 재탐색</S.RelocateButton>
          <S.NearestRouteButton onClick={handleNearestRoute}>가까운 경로 안내</S.NearestRouteButton>
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
          <S.LegendItem>
            <S.LegendDot $color="#9E9E9E" />
            <span>정보없음</span>
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
                  if (center.lat && center.lng && window.kakao && window.kakao.maps) {
                    const { kakao } = window;
                    const moveLatLon = new kakao.maps.LatLng(center.lat, center.lng);
                    map.setCenter(moveLatLon);
                  }
                }}
              >
                <MapMarker position={center} />

                {emergencyRooms.map((room) => {
                  if (!room.lat || !room.lng) return null;

                  const statusColor = getStatusColor(room.status);
                  const markerImage = getCustomMarkerImage(statusColor);

                  return (
                    <MapMarker
                      key={room.id}
                      position={{ lat: room.lat, lng: room.lng }}
                      image={{
                        src: markerImage,
                        size: { width: 24, height: 35 }
                      }}
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
                setCurrentPage(1);
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
            <S.LegendItem>
              <S.LegendDot $color="#9E9E9E" />
              <span>정보없음</span>
            </S.LegendItem>
          </S.StatusLegend>

          {loading && <S.LoadingMessage>응급실 정보를 불러오는 중...</S.LoadingMessage>}
          {apiError && <S.ErrorMessage>오류: {apiError}</S.ErrorMessage>}
          {!loading && !apiError && emergencyRooms.length === 0 && (
            <S.EmptyMessage>주변 응급실을 찾을 수 없습니다.</S.EmptyMessage>
          )}

          {!loading && !apiError && emergencyRooms.length > 0 && (() => {
            const sortedRooms = [...emergencyRooms].sort((a, b) => {
              if (sortBy === 'distance') {
                return a.distanceValue - b.distanceValue;
              } else if (sortBy === 'status') {
                // ✅ unknown은 마지막으로 보내기 (원하면 맨 앞으로도 가능)
                const statusOrder = { available: 1, crowded: 2, full: 3, unknown: 4 };
                return statusOrder[a.status] - statusOrder[b.status];
              }
              return 0;
            });

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
                          {room.status !== 'full' && room.status !== 'unknown' && room.waiting > 0 && ` (대기 ${room.waiting}명)`}
                        </S.StatusBadge>
                      </S.RoomHeader>

                      <S.RoomAddress>{room.address}</S.RoomAddress>
                      {room.hours && <S.RoomHours>{room.hours}</S.RoomHours>}

                      <S.RoomDistance>
                        {room.distance} {room.time}
                      </S.RoomDistance>

                      {room.phone && <S.RoomPhone>전화: {room.phone}</S.RoomPhone>}

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

                {totalPages > 1 && (
                  <S.Pagination>
                    <S.PaginationButton
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      이전
                    </S.PaginationButton>
                    <S.PaginationInfo>
                      {currentPage} / {totalPages}
                    </S.PaginationInfo>
                    <S.PaginationButton
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
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
          <S.HelpButton onClick={() => navigate('/main/help')}>도움말</S.HelpButton>
        </S.InfoPanel>
      </S.MainContent>
      <PatientAlertButton />
    </S.Container>
  );
};

export default MapContainer;
