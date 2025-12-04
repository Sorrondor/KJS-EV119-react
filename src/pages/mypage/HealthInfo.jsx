import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as S from './style';

const HealthInfo = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('basic'); // basic, medication, allergy, emergency

  const [healthData, setHealthData] = useState({
    basic: {
      bloodType: 'A',
      height: '170',
      weight: '70',
      chronicDiseases: ['고혈압']
    },
    medication: [
      { name: '고혈압약', dosage: '1일 1회', time: '아침 식후' },
      { name: '비타민D', dosage: '1일 1회', time: '저녁 식후' }
    ],
    allergy: [
      { type: '약물', name: '페니실린' },
      { type: '음식', name: '견과류' }
    ],
    emergency: [
      { name: '홍길동', relation: '가족', phone: '010-1234-5678' },
      { name: '김의사', relation: '주치의', phone: '02-1234-5678' }
    ]
  });

  const [formData, setFormData] = useState(healthData);

  const handleChange = (section, field, value) => {
    if (section === 'medication' || section === 'allergy' || section === 'emergency') {
      setFormData(prev => ({
        ...prev,
        [section]: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    }
  };

  const handleAddItem = (section) => {
    const newItem = section === 'medication' 
      ? { name: '', dosage: '', time: '' }
      : section === 'allergy'
      ? { type: '', name: '' }
      : { name: '', relation: '', phone: '' };
    
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], newItem]
    }));
  };

  const handleRemoveItem = (section, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    // 건강정보 저장 API 호출
    console.log('건강정보 저장:', formData);
    alert('건강정보가 저장되었습니다.');
    setIsEditing(false);
    setHealthData(formData);
  };

  const handleCancel = () => {
    setFormData(healthData);
    setIsEditing(false);
  };

  const tabs = [
    { id: 'basic', label: '기본정보', icon: '🏥' },
    { id: 'medication', label: '복용약물', icon: '💊' },
    { id: 'allergy', label: '알레르기', icon: '⚠️' },
    { id: 'emergency', label: '응급연락처', icon: '📞' }
  ];

  return (
    <S.Container>
      <S.Header>
        <S.BackButton onClick={() => navigate(-1)}>← 뒤로</S.BackButton>
        <S.Title>건강정보 관리</S.Title>
      </S.Header>

      <S.Content>
        <S.TabContainer>
          {tabs.map(tab => (
            <S.Tab
              key={tab.id}
              $active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              <S.TabIcon>{tab.icon}</S.TabIcon>
              <S.TabLabel>{tab.label}</S.TabLabel>
            </S.Tab>
          ))}
        </S.TabContainer>

        <S.HealthSection>
          {!isEditing && (
            <S.EditButton onClick={() => setIsEditing(true)}>
              수정
            </S.EditButton>
          )}

          {activeTab === 'basic' && (
            <S.BasicInfoSection>
              <S.InputGroup>
                <S.Label>혈액형</S.Label>
                {isEditing ? (
                  <S.Select
                    value={formData.basic.bloodType}
                    onChange={(e) => handleChange('basic', 'bloodType', e.target.value)}
                  >
                    <option value="A">A형</option>
                    <option value="B">B형</option>
                    <option value="AB">AB형</option>
                    <option value="O">O형</option>
                    <option value="RH-">RH-</option>
                  </S.Select>
                ) : (
                  <S.InfoValue>{formData.basic.bloodType}형</S.InfoValue>
                )}
              </S.InputGroup>

              <S.InputGroup>
                <S.Label>키 (cm)</S.Label>
                {isEditing ? (
                  <S.Input
                    type="number"
                    value={formData.basic.height}
                    onChange={(e) => handleChange('basic', 'height', e.target.value)}
                    placeholder="키를 입력하세요"
                  />
                ) : (
                  <S.InfoValue>{formData.basic.height}cm</S.InfoValue>
                )}
              </S.InputGroup>

              <S.InputGroup>
                <S.Label>몸무게 (kg)</S.Label>
                {isEditing ? (
                  <S.Input
                    type="number"
                    value={formData.basic.weight}
                    onChange={(e) => handleChange('basic', 'weight', e.target.value)}
                    placeholder="몸무게를 입력하세요"
                  />
                ) : (
                  <S.InfoValue>{formData.basic.weight}kg</S.InfoValue>
                )}
              </S.InputGroup>

              <S.InputGroup>
                <S.Label>기저질환</S.Label>
                {isEditing ? (
                  <S.TagInput
                    type="text"
                    placeholder="기저질환을 입력하고 Enter를 누르세요"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        handleChange('basic', 'chronicDiseases', [
                          ...formData.basic.chronicDiseases,
                          e.target.value.trim()
                        ]);
                        e.target.value = '';
                      }
                    }}
                  />
                ) : null}
                <S.TagContainer>
                  {formData.basic.chronicDiseases.map((disease, idx) => (
                    <S.Tag key={idx}>
                      {disease}
                      {isEditing && (
                        <S.TagRemove onClick={() => {
                          handleChange('basic', 'chronicDiseases', 
                            formData.basic.chronicDiseases.filter((_, i) => i !== idx)
                          );
                        }}>×</S.TagRemove>
                      )}
                    </S.Tag>
                  ))}
                </S.TagContainer>
              </S.InputGroup>
            </S.BasicInfoSection>
          )}

          {activeTab === 'medication' && (
            <S.MedicationSection>
              {formData.medication.map((med, idx) => (
                <S.MedicationCard key={idx}>
                  {isEditing ? (
                    <>
                      <S.InputGroup>
                        <S.Label>약물명</S.Label>
                        <S.Input
                          value={med.name}
                          onChange={(e) => {
                            const updated = [...formData.medication];
                            updated[idx].name = e.target.value;
                            handleChange('medication', null, updated);
                          }}
                          placeholder="약물명을 입력하세요"
                        />
                      </S.InputGroup>
                      <S.InputGroup>
                        <S.Label>용법</S.Label>
                        <S.Input
                          value={med.dosage}
                          onChange={(e) => {
                            const updated = [...formData.medication];
                            updated[idx].dosage = e.target.value;
                            handleChange('medication', null, updated);
                          }}
                          placeholder="예: 1일 1회"
                        />
                      </S.InputGroup>
                      <S.InputGroup>
                        <S.Label>복용시간</S.Label>
                        <S.Input
                          value={med.time}
                          onChange={(e) => {
                            const updated = [...formData.medication];
                            updated[idx].time = e.target.value;
                            handleChange('medication', null, updated);
                          }}
                          placeholder="예: 아침 식후"
                        />
                      </S.InputGroup>
                      <S.RemoveButton onClick={() => handleRemoveItem('medication', idx)}>
                        삭제
                      </S.RemoveButton>
                    </>
                  ) : (
                    <>
                      <S.MedicationName>{med.name}</S.MedicationName>
                      <S.MedicationInfo>{med.dosage} - {med.time}</S.MedicationInfo>
                    </>
                  )}
                </S.MedicationCard>
              ))}
              {isEditing && (
                <S.AddButton onClick={() => handleAddItem('medication')}>
                  + 약물 추가
                </S.AddButton>
              )}
            </S.MedicationSection>
          )}

          {activeTab === 'allergy' && (
            <S.AllergySection>
              {formData.allergy.map((item, idx) => (
                <S.AllergyCard key={idx}>
                  {isEditing ? (
                    <>
                      <S.InputGroup>
                        <S.Label>알레르기 유형</S.Label>
                        <S.Select
                          value={item.type}
                          onChange={(e) => {
                            const updated = [...formData.allergy];
                            updated[idx].type = e.target.value;
                            handleChange('allergy', null, updated);
                          }}
                        >
                          <option value="">선택하세요</option>
                          <option value="약물">약물</option>
                          <option value="음식">음식</option>
                          <option value="환경">환경</option>
                          <option value="기타">기타</option>
                        </S.Select>
                      </S.InputGroup>
                      <S.InputGroup>
                        <S.Label>알레르기 항목</S.Label>
                        <S.Input
                          value={item.name}
                          onChange={(e) => {
                            const updated = [...formData.allergy];
                            updated[idx].name = e.target.value;
                            handleChange('allergy', null, updated);
                          }}
                          placeholder="알레르기 항목을 입력하세요"
                        />
                      </S.InputGroup>
                      <S.RemoveButton onClick={() => handleRemoveItem('allergy', idx)}>
                        삭제
                      </S.RemoveButton>
                    </>
                  ) : (
                    <>
                      <S.AllergyType>{item.type}</S.AllergyType>
                      <S.AllergyName>{item.name}</S.AllergyName>
                    </>
                  )}
                </S.AllergyCard>
              ))}
              {isEditing && (
                <S.AddButton onClick={() => handleAddItem('allergy')}>
                  + 알레르기 추가
                </S.AddButton>
              )}
            </S.AllergySection>
          )}

          {activeTab === 'emergency' && (
            <S.EmergencySection>
              {formData.emergency.map((contact, idx) => (
                <S.EmergencyCard key={idx}>
                  {isEditing ? (
                    <>
                      <S.InputGroup>
                        <S.Label>이름</S.Label>
                        <S.Input
                          value={contact.name}
                          onChange={(e) => {
                            const updated = [...formData.emergency];
                            updated[idx].name = e.target.value;
                            handleChange('emergency', null, updated);
                          }}
                          placeholder="이름을 입력하세요"
                        />
                      </S.InputGroup>
                      <S.InputGroup>
                        <S.Label>관계</S.Label>
                        <S.Input
                          value={contact.relation}
                          onChange={(e) => {
                            const updated = [...formData.emergency];
                            updated[idx].relation = e.target.value;
                            handleChange('emergency', null, updated);
                          }}
                          placeholder="관계를 입력하세요"
                        />
                      </S.InputGroup>
                      <S.InputGroup>
                        <S.Label>전화번호</S.Label>
                        <S.Input
                          type="tel"
                          value={contact.phone}
                          onChange={(e) => {
                            const updated = [...formData.emergency];
                            updated[idx].phone = e.target.value;
                            handleChange('emergency', null, updated);
                          }}
                          placeholder="010-0000-0000"
                        />
                      </S.InputGroup>
                      <S.RemoveButton onClick={() => handleRemoveItem('emergency', idx)}>
                        삭제
                      </S.RemoveButton>
                    </>
                  ) : (
                    <>
                      <S.EmergencyName>{contact.name}</S.EmergencyName>
                      <S.EmergencyRelation>{contact.relation}</S.EmergencyRelation>
                      <S.EmergencyPhone href={`tel:${contact.phone}`}>
                        {contact.phone}
                      </S.EmergencyPhone>
                    </>
                  )}
                </S.EmergencyCard>
              ))}
              {isEditing && (
                <S.AddButton onClick={() => handleAddItem('emergency')}>
                  + 연락처 추가
                </S.AddButton>
              )}
            </S.EmergencySection>
          )}

          {isEditing && (
            <S.ButtonGroup>
              <S.CancelButton onClick={handleCancel}>취소</S.CancelButton>
              <S.SaveButton onClick={handleSave}>저장</S.SaveButton>
            </S.ButtonGroup>
          )}
        </S.HealthSection>
      </S.Content>
    </S.Container>
  );
};

export default HealthInfo;

