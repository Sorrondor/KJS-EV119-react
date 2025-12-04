import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as S from './style';

const VisitHistory = () => {
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [filter, setFilter] = useState('all'); // all, hospital, clinic, emergency

  const [visitHistory, setVisitHistory] = useState([
    {
      id: 1,
      date: '2024.01.15',
      hospital: '강남서울병원',
      department: '응급의학과',
      type: 'emergency',
      reason: '급성 복통',
      diagnosis: '급성 위염',
      treatment: '진통제 처방, 위보호제 복용',
      doctor: '김의사'
    },
    {
      id: 2,
      date: '2024.01.10',
      hospital: '역삼성모병원',
      department: '내과',
      type: 'hospital',
      reason: '정기 검진',
      diagnosis: '고혈압 관리',
      treatment: '혈압약 조정',
      doctor: '박의사'
    },
    {
      id: 3,
      date: '2023.12.20',
      hospital: '한빛의원',
      department: '일반의',
      type: 'clinic',
      reason: '감기 증상',
      diagnosis: '상기도 감염',
      treatment: '해열제, 진해제 처방',
      doctor: '이의사'
    }
  ]);

  const [newVisit, setNewVisit] = useState({
    date: '',
    hospital: '',
    department: '',
    type: 'hospital',
    reason: '',
    diagnosis: '',
    treatment: '',
    doctor: ''
  });

  const handleAdd = () => {
    if (!newVisit.date || !newVisit.hospital || !newVisit.department) {
      alert('날짜, 병원명, 진료과를 입력해주세요.');
      return;
    }

    const visit = {
      id: Date.now(),
      ...newVisit
    };

    setVisitHistory([visit, ...visitHistory]);
    setNewVisit({
      date: '',
      hospital: '',
      department: '',
      type: 'hospital',
      reason: '',
      diagnosis: '',
      treatment: '',
      doctor: ''
    });
    setIsAdding(false);
    alert('방문 이력이 추가되었습니다.');
  };

  const handleCancel = () => {
    setNewVisit({
      date: '',
      hospital: '',
      department: '',
      type: 'hospital',
      reason: '',
      diagnosis: '',
      treatment: '',
      doctor: ''
    });
    setIsAdding(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('이 방문 이력을 삭제하시겠습니까?')) {
      setVisitHistory(visitHistory.filter(visit => visit.id !== id));
    }
  };

  const filteredHistory = filter === 'all' 
    ? visitHistory 
    : visitHistory.filter(visit => visit.type === filter);

  const getTypeLabel = (type) => {
    switch(type) {
      case 'emergency': return '응급실';
      case 'hospital': return '병원';
      case 'clinic': return '의원';
      default: return '';
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'emergency': return '#CD0B16';
      case 'hospital': return '#2196F3';
      case 'clinic': return '#4CAF50';
      default: return '#666666';
    }
  };

  return (
    <S.Container>
      <S.Header>
        <S.BackButton onClick={() => navigate(-1)}>← 뒤로</S.BackButton>
        <S.Title>병원 방문 이력</S.Title>
      </S.Header>

      <S.Content>
        <S.FilterContainer>
          <S.FilterButton 
            $active={filter === 'all'} 
            onClick={() => setFilter('all')}
          >
            전체
          </S.FilterButton>
          <S.FilterButton 
            $active={filter === 'emergency'} 
            onClick={() => setFilter('emergency')}
          >
            응급실
          </S.FilterButton>
          <S.FilterButton 
            $active={filter === 'hospital'} 
            onClick={() => setFilter('hospital')}
          >
            병원
          </S.FilterButton>
          <S.FilterButton 
            $active={filter === 'clinic'} 
            onClick={() => setFilter('clinic')}
          >
            의원
          </S.FilterButton>
        </S.FilterContainer>

        {!isAdding && (
          <S.AddButton onClick={() => setIsAdding(true)}>
            + 방문 이력 추가
          </S.AddButton>
        )}

        {isAdding && (
          <S.AddFormCard>
            <S.FormTitle>새 방문 이력 추가</S.FormTitle>
            <S.InputGroup>
              <S.Label>방문일</S.Label>
              <S.Input
                type="date"
                value={newVisit.date}
                onChange={(e) => setNewVisit({...newVisit, date: e.target.value})}
              />
            </S.InputGroup>
            <S.InputGroup>
              <S.Label>병원명</S.Label>
              <S.Input
                type="text"
                value={newVisit.hospital}
                onChange={(e) => setNewVisit({...newVisit, hospital: e.target.value})}
                placeholder="병원명을 입력하세요"
              />
            </S.InputGroup>
            <S.InputGroup>
              <S.Label>진료과</S.Label>
              <S.Input
                type="text"
                value={newVisit.department}
                onChange={(e) => setNewVisit({...newVisit, department: e.target.value})}
                placeholder="진료과를 입력하세요"
              />
            </S.InputGroup>
            <S.InputGroup>
              <S.Label>방문 유형</S.Label>
              <S.Select
                value={newVisit.type}
                onChange={(e) => setNewVisit({...newVisit, type: e.target.value})}
              >
                <option value="hospital">병원</option>
                <option value="clinic">의원</option>
                <option value="emergency">응급실</option>
              </S.Select>
            </S.InputGroup>
            <S.InputGroup>
              <S.Label>방문 사유</S.Label>
              <S.TextArea
                value={newVisit.reason}
                onChange={(e) => setNewVisit({...newVisit, reason: e.target.value})}
                placeholder="방문 사유를 입력하세요"
                rows="3"
              />
            </S.InputGroup>
            <S.InputGroup>
              <S.Label>진단명</S.Label>
              <S.Input
                type="text"
                value={newVisit.diagnosis}
                onChange={(e) => setNewVisit({...newVisit, diagnosis: e.target.value})}
                placeholder="진단명을 입력하세요"
              />
            </S.InputGroup>
            <S.InputGroup>
              <S.Label>치료 내용</S.Label>
              <S.TextArea
                value={newVisit.treatment}
                onChange={(e) => setNewVisit({...newVisit, treatment: e.target.value})}
                placeholder="치료 내용을 입력하세요"
                rows="3"
              />
            </S.InputGroup>
            <S.InputGroup>
              <S.Label>담당 의사</S.Label>
              <S.Input
                type="text"
                value={newVisit.doctor}
                onChange={(e) => setNewVisit({...newVisit, doctor: e.target.value})}
                placeholder="담당 의사명을 입력하세요"
              />
            </S.InputGroup>
            <S.ButtonGroup>
              <S.CancelButton onClick={handleCancel}>취소</S.CancelButton>
              <S.SaveButton onClick={handleAdd}>추가</S.SaveButton>
            </S.ButtonGroup>
          </S.AddFormCard>
        )}

        <S.HistoryList>
          {filteredHistory.length === 0 ? (
            <S.EmptyMessage>
              {filter === 'all' ? '방문 이력이 없습니다.' : '해당 유형의 방문 이력이 없습니다.'}
            </S.EmptyMessage>
          ) : (
            filteredHistory.map((visit) => (
              <S.HistoryCard key={visit.id}>
                <S.HistoryHeader>
                  <S.HistoryDate>{visit.date}</S.HistoryDate>
                  <S.TypeBadge $color={getTypeColor(visit.type)}>
                    {getTypeLabel(visit.type)}
                  </S.TypeBadge>
                  <S.DeleteButton onClick={() => handleDelete(visit.id)}>
                    삭제
                  </S.DeleteButton>
                </S.HistoryHeader>
                <S.HospitalName>{visit.hospital}</S.HospitalName>
                <S.Department>{visit.department}</S.Department>
                {visit.doctor && (
                  <S.DoctorInfo>담당의: {visit.doctor}</S.DoctorInfo>
                )}
                {visit.reason && (
                  <S.InfoRow>
                    <S.InfoLabel>방문 사유:</S.InfoLabel>
                    <S.InfoValue>{visit.reason}</S.InfoValue>
                  </S.InfoRow>
                )}
                {visit.diagnosis && (
                  <S.InfoRow>
                    <S.InfoLabel>진단명:</S.InfoLabel>
                    <S.InfoValue $highlight>{visit.diagnosis}</S.InfoValue>
                  </S.InfoRow>
                )}
                {visit.treatment && (
                  <S.InfoRow>
                    <S.InfoLabel>치료 내용:</S.InfoLabel>
                    <S.InfoValue>{visit.treatment}</S.InfoValue>
                  </S.InfoRow>
                )}
              </S.HistoryCard>
            ))
          )}
        </S.HistoryList>
      </S.Content>
    </S.Container>
  );
};

export default VisitHistory;

