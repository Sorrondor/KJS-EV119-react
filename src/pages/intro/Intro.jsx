import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import UserHeader from '../../components/header/UserHeader';
import * as S from './style';

const Intro = () => {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const recognitionRef = useRef(null);

  // 환자 상태별 응급조치 데이터
  const emergencyProcedures = [
    {
      symptom: '의식 없음',
      keywords: ['의식', '의식불명', '기절', '혼수', '깨어나지 않음'],
      urgency: 'critical',
      procedures: [
        '환자를 안전한 곳으로 이동',
        '기도를 확보하고 호흡 확인',
        '맥박 확인',
        '즉시 119 신고 및 심폐소생술 시행',
        '옷깃을 풀고 편안한 자세 유지'
      ]
    },
    {
      symptom: '호흡 곤란',
      keywords: ['호흡', '숨', '쉬기', '호흡곤란', '숨막힘', '가쁨'],
      urgency: 'critical',
      procedures: [
        '환자를 앉은 자세로 유지',
        '옷깃을 풀고 편안하게',
        '산소 공급 가능하면 제공',
        '119 신고 및 즉시 응급실 방문',
        '호흡 상태 지속 관찰'
      ]
    },
    {
      symptom: '출혈',
      keywords: ['출혈', '피', '상처', '절단', '찔림'],
      urgency: 'high',
      procedures: [
        '깨끗한 천이나 거즈로 직접 압박',
        '상처 부위를 심장보다 높게 유지',
        '지혈대 사용 (심한 경우)',
        '출혈량 확인 및 지속 관찰',
        '119 신고 또는 응급실 방문'
      ]
    },
    {
      symptom: '심장마비',
      keywords: ['심장', '심장마비', '가슴', '흉통', '심박'],
      urgency: 'critical',
      procedures: [
        '즉시 119 신고',
        '심폐소생술(CPR) 시행',
        '자동제세동기(AED) 사용 가능하면 사용',
        '환자를 바닥에 평평하게 눕힘',
        '의식 회복까지 지속적인 응급처치'
      ]
    },
    {
      symptom: '뇌졸중',
      keywords: ['뇌졸중', '중풍', '마비', '언어장애', '시야장애', '어지러움'],
      urgency: 'critical',
      procedures: [
        '즉시 119 신고',
        '환자를 편안한 자세로 유지',
        '목을 똑바로 유지',
        '음식이나 물 주지 않기',
        '증상 발생 시간 기록',
        '가능한 빨리 병원 도착 (골든타임 3시간)'
      ]
    },
    {
      symptom: '화상',
      keywords: ['화상', '뜨거움', '화재', '끓는물', '증기'],
      urgency: 'high',
      procedures: [
        '화상 부위를 흐르는 찬물에 15-20분간 식히기',
        '화상 부위에 옷이 달라붙었으면 잘라내기',
        '거품이나 연고 바르지 않기',
        '화상 부위를 깨끗한 천으로 가볍게 덮기',
        '심한 화상은 즉시 응급실 방문'
      ]
    },
    {
      symptom: '골절',
      keywords: ['골절', '부러짐', '뼈', '손목', '발목', '팔', '다리'],
      urgency: 'medium',
      procedures: [
        '부상 부위 움직이지 않기',
        '부목으로 고정',
        '얼음 찜질로 부종 완화',
        '부상 부위를 심장보다 높게 유지',
        '응급실 방문하여 X-ray 촬영'
      ]
    },
    {
      symptom: '중독',
      keywords: ['중독', '약물', '독', '먹은', '마신', '화학물질'],
      urgency: 'critical',
      procedures: [
        '즉시 119 신고',
        '중독물질 확인 및 보관',
        '의식이 있으면 구토 유도하지 않기',
        '의식이 없으면 기도 확보',
        '중독물질 정보를 의료진에게 전달'
      ]
    },
    {
      symptom: '알레르기 반응',
      keywords: ['알레르기', '두드러기', '부종', '가려움', '호흡곤란'],
      urgency: 'high',
      procedures: [
        '알레르기 원인 제거',
        '호흡 곤란 시 즉시 119 신고',
        '에피펜(자가주사기) 보유 시 사용',
        '항히스타민제 복용 가능하면 복용',
        '증상 악화 시 응급실 방문'
      ]
    },
    {
      symptom: '경련',
      keywords: ['경련', '발작', '떨림', '경기', '뇌전증'],
      urgency: 'high',
      procedures: [
        '환자 주변 위험물 제거',
        '부드러운 물건으로 머리 보호',
        '입에 아무것도 넣지 않기',
        '옷깃을 풀고 편안하게',
        '경련 후 의식 회복 대기',
        '5분 이상 지속 시 119 신고'
      ]
    }
  ];

  // 임시 응급실 데이터 (실제로는 API에서 가져와야 함)
  const emergencyRooms = [
    {
      id: 1,
      name: '강남서울 응급의료센터',
      distance: '0.8 km',
      time: '도보 약 10분'
    },
    {
      id: 2,
      name: '역삼성모병원 응급실',
      distance: '1.4 km',
      time: '차량 5분'
    },
    {
      id: 3,
      name: '한빛대학교병원 응급센터',
      distance: '2.7 km',
      time: '차량 10분'
    }
  ];

  const handleAmbulanceCall = () => {
    // 전화 걸기
    window.location.href = 'tel:119';
    // 전화가 걸렸다는 알림
    setTimeout(() => {
      alert('119에 신고되었습니다.\n구급차가 출동합니다.');
    }, 500);
  };

  const handleEmergencyRoomInfo = () => {
    navigate('/main/map');
  };

  const handleHelp = () => {
    navigate('/main/help');
  };

  const searchEmergencyProcedures = (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const lowerTerm = term.toLowerCase();
    const matched = emergencyProcedures.filter(item => {
      return item.keywords.some(keyword => 
        keyword.includes(lowerTerm) || lowerTerm.includes(keyword)
      ) || item.symptom.includes(lowerTerm);
    });

    setSearchResults(matched);
    setShowResults(matched.length > 0);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    searchEmergencyProcedures(value);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      if (searchResults.length > 0) {
        // 첫 번째 결과를 상세히 보여주거나 처리
        setShowResults(true);
      } else if (searchTerm.trim()) {
        // 검색 결과가 없으면 일반 검색으로 처리
        console.log('검색어:', searchTerm);
        navigate('/main/map');
      }
    }
  };

  const handleResultClick = (result) => {
    setSearchTerm(result.symptom);
    setShowResults(true);
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('이 브라우저는 음성인식을 지원하지 않습니다.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'ko-KR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchTerm(transcript);
      setIsListening(false);
      
      // 음성인식 결과로 자동 검색
      if (transcript.trim()) {
        searchEmergencyProcedures(transcript);
      }
    };

    recognition.onerror = (event) => {
      console.error('음성인식 오류:', event.error);
      setIsListening(false);
      if (event.error === 'no-speech') {
        alert('음성이 감지되지 않았습니다. 다시 시도해주세요.');
      } else if (event.error === 'not-allowed') {
        alert('마이크 권한이 허용되지 않았습니다.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
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
          <S.SearchLabel>환자 상태 진단 / 응급조치 검색</S.SearchLabel>
          <S.SearchInputWrapper>
            <S.SearchInput
              type="text"
              placeholder="예: 의식 없음, 호흡 곤란, 출혈, 심장마비 등"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyPress={handleSearch}
              onFocus={() => searchTerm && searchEmergencyProcedures(searchTerm)}
            />
            <S.VoiceButton
              onClick={isListening ? stopListening : startListening}
              $isListening={isListening}
              type="button"
              aria-label="음성인식"
            >
              {isListening ? '⏹️' : '🎤'}
            </S.VoiceButton>
          </S.SearchInputWrapper>
          {isListening && (
            <S.ListeningIndicator>음성인식 중...</S.ListeningIndicator>
          )}
          {showResults && searchResults.length > 0 && (
            <>
              <S.SearchResults>
                {searchResults.map((result, index) => (
                  <S.ResultCard key={index} $urgency={result.urgency}>
                    <S.ResultHeader>
                      <S.ResultSymptom>{result.symptom}</S.ResultSymptom>
                      <S.UrgencyBadge $urgency={result.urgency}>
                        {result.urgency === 'critical' ? '긴급' : 
                         result.urgency === 'high' ? '높음' : '보통'}
                      </S.UrgencyBadge>
                    </S.ResultHeader>
                    <S.ProceduresList>
                      {result.procedures.map((procedure, idx) => (
                        <S.ProcedureItem key={idx}>
                          <S.ProcedureNumber>{idx + 1}</S.ProcedureNumber>
                          <S.ProcedureText>{procedure}</S.ProcedureText>
                        </S.ProcedureItem>
                      ))}
                    </S.ProceduresList>
                  </S.ResultCard>
                ))}
              </S.SearchResults>
              <S.EmergencyRouteButton onClick={handleNearestRoute}>
                <S.RouteIcon>🧭</S.RouteIcon>
                <S.RouteText>
                  <S.RouteTitle>가장 가까운 응급실로 길찾기</S.RouteTitle>
                  <S.RouteSubtitle>네비게이션 시작</S.RouteSubtitle>
                </S.RouteText>
              </S.EmergencyRouteButton>
            </>
          )}
          {showResults && searchResults.length === 0 && searchTerm.trim() && (
            <S.NoResults>
              검색 결과가 없습니다. 다른 키워드로 검색해보세요.
            </S.NoResults>
          )}
        </S.SearchSection>

      </S.MainContent>

      <S.Footer>
        <S.FooterText>응급 상황 시 즉시 119에 신고하세요</S.FooterText>
      </S.Footer>
    </S.Container>
  );
};

export default Intro;

