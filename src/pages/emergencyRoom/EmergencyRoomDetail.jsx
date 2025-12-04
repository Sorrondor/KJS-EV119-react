import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserHeader from '../../components/header/UserHeader';
import * as S from './style';

const EmergencyRoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);

  // 임시 데이터
  const emergencyRooms = {
    1: {
      id: 1,
      name: '강남서울 응급의료센터',
      fullName: '강남서울병원 응급의료센터',
      address: '서울 강남구 테헤란로 123',
      detailAddress: '강남서울병원 B동 1층 응급실',
      hours: '24시간 응급실 운영',
      distance: '0.8 km',
      time: '도보 약 10분',
      status: 'crowded',
      waiting: 12,
      specialties: ['뇌·심혈관 전문', '중증 응급 수용 가능'],
      phone: '02-1234-5678',
      message: '현재 응급실이 혼잡합니다. 대기 시간이 예상보다 길 수 있습니다.',
      facilities: ['CT', 'MRI', '수술실', '중환자실', '소아전용 구역'],
      departments: ['내과', '외과', '소아과', '정형외과', '신경과']
    },
    2: {
      id: 2,
      name: '역삼성모병원 응급실',
      fullName: '역삼성모병원 응급의료센터',
      address: '서울 강남구 역삼로 45',
      detailAddress: '역삼성모병원 본관 지하 1층',
      hours: '24시간 응급실 운영',
      distance: '1.4 km',
      time: '차량 5분',
      status: 'available',
      waiting: 3,
      specialties: ['소아 응급 가능', '구급차 우선'],
      phone: '02-2345-6789',
      message: '현재 응급실이 여유롭습니다.',
      facilities: ['CT', 'MRI', '수술실', '소아전용 구역'],
      departments: ['내과', '외과', '소아과', '정형외과']
    },
    3: {
      id: 3,
      name: '한빛대학교병원 응급센터',
      fullName: '한빛대학교병원 응급의료센터',
      address: '서울 서초구 서초대로 201',
      detailAddress: '한빛의료타워 1층 응급의료센터',
      hours: '24시간 응급실 운영',
      distance: '2.7 km',
      time: '차량 10분',
      status: 'full',
      waiting: 0,
      specialties: ['중증외상센터', 'ICU 만실'],
      phone: '02-3456-7890',
      message: '현재 응급실이 포화 상태입니다. 수용이 어려울 수 있습니다.',
      facilities: ['CT', 'MRI', '수술실', '중환자실', '외상센터'],
      departments: ['내과', '외과', '정형외과', '신경외과', '흉부외과']
    }
  };

  useEffect(() => {
    const selectedRoom = emergencyRooms[id];
    if (selectedRoom) {
      setRoom(selectedRoom);
    }
  }, [id]);

  if (!room) {
    return (
      <S.Container>
        <S.Loading>로딩 중...</S.Loading>
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
    navigate(`/main/route/${id}`);
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

