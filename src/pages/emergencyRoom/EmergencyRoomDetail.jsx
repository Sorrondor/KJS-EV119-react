import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserHeader from '../../components/header/UserHeader';
import * as S from './style';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:10000';

const EmergencyRoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError('병원 ID가 없습니다.');
      setLoading(false);
      return;
    }

    fetchEmergencyRoomDetail(id);
  }, [id]);

  // 백엔드 API로 응급의료기관 기본정보 조회
  const fetchEmergencyRoomDetail = async (hpid) => {
    try {
      setLoading(true);
      setError(null);

      // 백엔드 API 호출: 기관ID 기반 기본정보 조회
      // 먼저 검색 API로 해당 병원 찾기
      const searchUrl = `${BACKEND_URL}/api/emergency/search-emergency?lat=37.5665&lon=126.9780&pageNo=1&numOfRows=100`;
      
      const searchResponse = await fetch(searchUrl);
      
      if (!searchResponse.ok) {
        throw new Error(`API 호출 실패: ${searchResponse.status}`);
      }

      const searchData = await searchResponse.json();
      const items = searchData?.data?.body?.items || searchData?.body?.items || searchData?.items || [];
      
      // hpid로 해당 병원 찾기
      const item = items.find(h => h.hpid === hpid);
      
      if (!item) {
        throw new Error('병원 정보를 찾을 수 없습니다.');
      }

      const dutyName = item.dutyName || '';
      const dutyAddr = item.dutyAddr || '';
      const dutyTel1 = item.dutyTel1 || '';
      const dutyTel3 = item.dutyTel3 || '';
      const dutyDivName = item.dutyDivName || '';
      const dutyEmclsName = item.dutyEmclsName || '';
      const dgidldName = item.dgidldName || '';
      const dutyTime1s = item.dutyTime1s || '';
      const dutyTime1c = item.dutyTime1c || '';
      const hvec = parseInt(item.hvec || '0');
      const hvoc = parseInt(item.hvoc || '0');
      const hvgc = parseInt(item.hvgc || '0');
      const hpicuyn = parseInt(item.hpicuyn || '0');
      const hvctayn = item.hvctayn || 'N';
      const hvmriayn = item.hvmriayn || 'N';

      // 진료과목 파싱 (쉼표로 구분)
      const departments = dgidldName ? dgidldName.split(',').map(d => d.trim()).filter(d => d) : [];

      // 시설 정보 구성
      const facilities = [];
      if (hvctayn === 'Y') facilities.push('CT');
      if (hvmriayn === 'Y') facilities.push('MRI');
      if (hvoc > 0) facilities.push('수술실');
      if (hpicuyn > 0) facilities.push('중환자실');
      if (hvgc > 0) facilities.push('입원실');

      // 운영 시간 포맷팅
      let hours = '24시간 응급실 운영';
      if (dutyTime1s && dutyTime1c) {
        const startTime = `${dutyTime1s.substring(0, 2)}:${dutyTime1s.substring(2, 4)}`;
        const endTime = `${dutyTime1c.substring(0, 2)}:${dutyTime1c.substring(2, 4)}`;
        hours = `${startTime} - ${endTime}`;
      }

      // 상태 결정
      let status = 'available';
      let waiting = 0;
      let message = '현재 응급실이 여유롭습니다.';

      if (hvec === 0) {
        status = 'full';
        message = '현재 응급실이 포화 상태입니다. 수용이 어려울 수 있습니다.';
      } else if (hvec < 5) {
        status = 'crowded';
        waiting = 10;
        message = '현재 응급실이 혼잡합니다. 대기 시간이 예상보다 길 수 있습니다.';
      } else if (hvec < 10) {
        status = 'crowded';
        waiting = 5;
        message = '현재 응급실이 다소 혼잡합니다.';
      }

      const roomData = {
        id: hpid,
        hpid: hpid,
        name: dutyName,
        fullName: dutyName,
        address: dutyAddr,
        detailAddress: '',
        hours: hours,
        status: status,
        waiting: waiting,
        phone: dutyTel3 || dutyTel1,
        message: message,
        specialties: dutyEmclsName ? [dutyEmclsName] : dutyDivName ? [dutyDivName] : [],
        departments: departments.length > 0 ? departments : ['내과', '외과', '소아과'],
        facilities: facilities.length > 0 ? facilities : ['CT', 'MRI', '수술실'],
      };

      setRoom(roomData);
    } catch (error) {
      console.error('응급실 상세 정보 조회 실패:', error);
      setError(error.message || '응급실 정보를 가져오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <S.Container>
        <UserHeader />
        <S.Loading>로딩 중...</S.Loading>
      </S.Container>
    );
  }

  if (error || !room) {
    return (
      <S.Container>
        <UserHeader />
        <S.Header>
          <S.BackButton onClick={() => navigate(-1)}>← 뒤로</S.BackButton>
          <S.Title>오류</S.Title>
        </S.Header>
        <S.Content>
          <S.ErrorMessage>{error || '병원 정보를 찾을 수 없습니다.'}</S.ErrorMessage>
        </S.Content>
      </S.Container>
    );
  }

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

  const handleRouteGuidance = () => {
    navigate(`/main/navigation/${id}`);
  };

  const handleCall = () => {
    window.location.href = `tel:${room.phone}`;
  };

  return (
    <S.Container>
      <UserHeader />
      <S.Header>
        <S.BackButton onClick={() => navigate(-1)}>← 뒤로</S.BackButton>
        <S.Title>{room.fullName}</S.Title>
      </S.Header>

      <S.Content>
        <S.StatusSection>
          <S.StatusBadge $color={getStatusColor(room.status)}>
            <S.StatusDot $color={getStatusColor(room.status)} />
            {getStatusText(room.status)}
            {room.status !== 'full' && ` (대기 ${room.waiting}명)`}
          </S.StatusBadge>
          {room.message && (
            <S.MessageBox $status={room.status}>
              {room.message}
            </S.MessageBox>
          )}
        </S.StatusSection>

        <S.InfoSection>
          <S.SectionTitle>기본 정보</S.SectionTitle>
          <S.InfoItem>
            <S.InfoLabel>거리</S.InfoLabel>
            <S.InfoValue>{room.distance} {room.time}</S.InfoValue>
          </S.InfoItem>
          <S.InfoItem>
            <S.InfoLabel>주소</S.InfoLabel>
            <S.InfoValue>
              {room.address}<br />
              {room.detailAddress}
            </S.InfoValue>
          </S.InfoItem>
          <S.InfoItem>
            <S.InfoLabel>운영 시간</S.InfoLabel>
            <S.InfoValue>{room.hours}</S.InfoValue>
          </S.InfoItem>
          <S.InfoItem>
            <S.InfoLabel>전화번호</S.InfoLabel>
            <S.InfoValue>
              <S.PhoneLink href={`tel:${room.phone}`}>
                {room.phone}
              </S.PhoneLink>
            </S.InfoValue>
          </S.InfoItem>
        </S.InfoSection>

        <S.InfoSection>
          <S.SectionTitle>전문 분야</S.SectionTitle>
          <S.SpecialtyList>
            {room.specialties.map((specialty, idx) => (
              <S.SpecialtyTag key={idx}>{specialty}</S.SpecialtyTag>
            ))}
          </S.SpecialtyList>
        </S.InfoSection>

        <S.InfoSection>
          <S.SectionTitle>진료 과목</S.SectionTitle>
          <S.DepartmentList>
            {room.departments.map((dept, idx) => (
              <S.DepartmentTag key={idx}>{dept}</S.DepartmentTag>
            ))}
          </S.DepartmentList>
        </S.InfoSection>

        <S.InfoSection>
          <S.SectionTitle>시설</S.SectionTitle>
          <S.FacilityList>
            {room.facilities.map((facility, idx) => (
              <S.FacilityTag key={idx}>{facility}</S.FacilityTag>
            ))}
          </S.FacilityList>
        </S.InfoSection>
      </S.Content>

      <S.ActionButtons>
        <S.PrimaryButton onClick={handleRouteGuidance}>
          경로 안내
        </S.PrimaryButton>
        <S.SecondaryButton onClick={handleCall}>
          전화하기
        </S.SecondaryButton>
      </S.ActionButtons>
    </S.Container>
  );
};

export default EmergencyRoomDetail;

