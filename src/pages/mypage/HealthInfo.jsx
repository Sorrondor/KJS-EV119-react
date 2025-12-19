import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./style";

const HealthInfo = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("basic"); // basic, medication, allergy, emergency
  const [diseases, setDiseases] = useState([]);
  const [health, setHealth] = useState({
    bloodRh: "-",
    bloodAbo: "",
    height: "-",
    weight: "-",
    diseases: diseases,
  });
  const [medications, setMedications] = useState([
    {
      medicationName: "-",
      medicationUsage: "-",
      medicationTakingtime: "-",
    },
  ]);
  const [allergies, setAllergies] = useState([
    { allergyType: "-", allergyName: "-" },
  ]);
  const [emergencyPhones, setEmergencyPhones] = useState([
    {
      emergencyPhoneName: "-",
      emergencyPhoneRelationship: "-",
      emergencyPhoneNumber: "-",
    },
  ]);

  const [healthData, setHealthData] = useState({
    basic: health,
    medication: medications,
    allergy: allergies,
    emergency: emergencyPhones,
  });

  const [formData, setFormData] = useState(healthData);

  const handleChange = (section, field, value) => {
    if (
      section === "medication" ||
      section === "allergy" ||
      section === "emergencyPhones"
    ) {
      setFormData((prev) => ({
        ...prev,
        [section]: value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    }
  };

  const handleAddItem = (section) => {
    const newItem =
      section === "medication"
        ? { medicationName: "", medicationUsage: "", medicationTakingtime: "" }
        : section === "allergy"
        ? { allergyType: "", allergyName: "" }
        : {
            emergencyPhoneName: "",
            emergencyPhoneRelationship: "",
            emergencyPhoneNumber: "",
          };

    setFormData((prev) => ({
      ...prev,
      [section]: [...prev[section], newItem],
    }));
  };

  const handleRemoveItem = (section, index) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    try {
      // 기본정보 수정
      await fetch(`${privateUrl}/my-page/health/modify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(formData.basic),
      });

      // 복용약물 수정
      await fetch(`${privateUrl}/my-page/medication/modify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(formData.medication),
      });

      // 알레르기 수정
      await fetch(`${privateUrl}/my-page/allergy/modify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(formData.allergy),
      });

      // 응급연락처 수정
      await fetch(`${privateUrl}/my-page/emergency-phone/modify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(formData.emergencyPhones),
      });

      // 기저질환 추가 (변경된 것만)
      const currentDiseases = healthData.basic?.diseases || [];
      const newDiseases = formData.basic.diseases.filter(
        (d) => !currentDiseases.includes(d)
      );
      for (const disease of newDiseases) {
        await fetch(
          `${privateUrl}/my-page/health/add-disease?diseaseName=${encodeURIComponent(
            disease
          )}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
      }

      alert("건강정보가 저장되었습니다.");
      setIsEditing(false);
      setHealthData(formData);
    } catch (error) {
      console.error("Error saving health data:", error);
      alert("건강정보 저장에 실패했습니다.");
    }
  };

  const handleCancel = () => {
    setFormData(healthData);
    setIsEditing(false);
  };

  const tabs = [
    { id: "basic", label: "기본정보", icon: "🏥" },
    { id: "medication", label: "복용약물", icon: "💊" },
    { id: "allergy", label: "알레르기", icon: "⚠️" },
    { id: "emergencyPhones", label: "응급연락처", icon: "📞" },
  ];

  const privateUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:10000";

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // 건강 정보 가져오기
        const healthResponse = await fetch(`${privateUrl}/my-page/health`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        const healthResult = await healthResponse.json();
        setHealth(healthResult.data || {});

        // 복용약물 가져오기
        const medicationResponse = await fetch(
          `${privateUrl}/my-page/medication`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        const medicationResult = await medicationResponse.json();
        setMedications(medicationResult.data || []);

        // 알레르기 가져오기
        const allergyResponse = await fetch(`${privateUrl}/my-page/allergy`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        const allergyResult = await allergyResponse.json();
        setAllergies(allergyResult.data || []);

        // 응급연락처 가져오기
        const emergencyResponse = await fetch(
          `${privateUrl}/my-page/emergency-phone`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        const emergencyResult = await emergencyResponse.json();
        setEmergencyPhones(emergencyResult.data || []);

        const allData = {
          basic: {
            bloodRh: health.bloodRh,
            bloodAbo: health.bloodAbo,
            height: health.height,
            weight: health.weight,
            diseases: health.diseases || [],
          },
          medication: medications,
          allergy: allergies,
          emergencyPhones: emergencyPhones,
        };
        setDiseases(allData.basic.diseases || []);
        setFormData(allData);
      } catch (error) {
        console.error("Error fetching health data:", error);
      }
    };

    fetchAllData();
  }, []);

  return (
    <S.Container>
      <S.Header>
        <S.BackButton onClick={() => navigate(-1)}>← 뒤로</S.BackButton>
        <S.Title>건강정보 관리</S.Title>
      </S.Header>

      <S.Content>
        <S.TabContainer>
          {tabs.map((tab) => (
            <S.Tab
              key={tab.id}
              $active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}>
              <S.TabIcon>{tab.icon}</S.TabIcon>
              <S.TabLabel>{tab.label}</S.TabLabel>
            </S.Tab>
          ))}
        </S.TabContainer>

        <S.HealthSection>
          {!isEditing && (
            <S.EditButton onClick={() => setIsEditing(true)}>수정</S.EditButton>
          )}

          {activeTab === "basic" && (
            <S.BasicInfoSection>
              <S.InputGroup>
                <S.Label>혈액형</S.Label>
                {isEditing ? (
                  <>
                    <S.Select
                      value={formData.basic.bloodRh}
                      onChange={(e) =>
                        handleChange("basic", "bloodRh", e.target.value)
                      }>
                      <option value="RH+">RH+</option>
                      <option value="RH-">RH-</option>
                    </S.Select>
                    <S.Select
                      value={formData.basic.bloodAbo}
                      onChange={(e) =>
                        handleChange("basic", "bloodAbo", e.target.value)
                      }>
                      <option value="A">A형</option>
                      <option value="B">B형</option>
                      <option value="AB">AB형</option>
                      <option value="O">O형</option>
                    </S.Select>
                  </>
                ) : (
                  <S.InfoValue>
                    {formData.basic.bloodRh}
                    &nbsp;&nbsp;
                    {formData.basic.bloodAbo + " 형"}
                  </S.InfoValue>
                )}
              </S.InputGroup>

              <S.InputGroup>
                <S.Label>키 (cm)</S.Label>
                {isEditing ? (
                  <S.Input
                    type="number"
                    value={formData.basic.height}
                    onChange={(e) =>
                      handleChange("basic", "height", e.target.value)
                    }
                    placeholder="키를 입력하세요"
                  />
                ) : (
                  <S.InfoValue>{formData.basic.height + " cm"}</S.InfoValue>
                )}
              </S.InputGroup>

              <S.InputGroup>
                <S.Label>몸무게 (kg)</S.Label>
                {isEditing ? (
                  <S.Input
                    type="number"
                    value={formData.basic.weight}
                    onChange={(e) =>
                      handleChange("basic", "weight", e.target.value)
                    }
                    placeholder="몸무게를 입력하세요"
                  />
                ) : (
                  <S.InfoValue>{formData.basic.weight + " kg"}</S.InfoValue>
                )}
              </S.InputGroup>

              <S.InputGroup>
                <S.Label>기저질환</S.Label>
                {isEditing ? (
                  <S.TagInput
                    type="text"
                    placeholder="기저질환을 입력하고 Enter를 누르세요"
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && e.target.value.trim()) {
                        handleChange("basic", "diseases", [
                          ...formData.basic.diseases,
                          e.target.value.trim(),
                        ]);
                        e.target.value = "";
                      }
                    }}
                  />
                ) : null}
                <S.TagContainer>
                  {formData.basic.diseases.map((disease, idx) => (
                    <S.Tag key={idx}>
                      {disease}
                      {isEditing && (
                        <S.TagRemove
                          onClick={() => {
                            handleChange(
                              "basic",
                              "diseases",
                              formData.basic.diseases.filter(
                                (_, i) => i !== idx
                              )
                            );
                          }}>
                          ×
                        </S.TagRemove>
                      )}
                    </S.Tag>
                  ))}
                </S.TagContainer>
              </S.InputGroup>
            </S.BasicInfoSection>
          )}

          {activeTab === "medication" && (
            <S.MedicationSection>
              {formData.medication.map((med, idx) => (
                <S.MedicationCard key={idx}>
                  {isEditing ? (
                    <>
                      <S.InputGroup>
                        <S.Label>약물명</S.Label>
                        <S.Input
                          value={med.medicationName}
                          onChange={(e) => {
                            const updated = [...formData.medication];
                            updated[idx].medicationName = e.target.value;
                            handleChange("medication", null, updated);
                          }}
                          placeholder="약물명을 입력하세요"
                        />
                      </S.InputGroup>
                      <S.InputGroup>
                        <S.Label>용법</S.Label>
                        <S.Input
                          value={med.medicationUsage}
                          onChange={(e) => {
                            const updated = [...formData.medication];
                            updated[idx].medicationUsage = e.target.value;
                            handleChange("medication", null, updated);
                          }}
                          placeholder="예: 1일 1회"
                        />
                      </S.InputGroup>
                      <S.InputGroup>
                        <S.Label>복용시간</S.Label>
                        <S.Input
                          value={med.medicationTakingtime}
                          onChange={(e) => {
                            const updated = [...formData.medication];
                            updated[idx].medicationTakingtime = e.target.value;
                            handleChange("medication", null, updated);
                          }}
                          placeholder="예: 아침 식후"
                        />
                      </S.InputGroup>
                      <S.RemoveButton
                        onClick={() => handleRemoveItem("medication", idx)}>
                        삭제
                      </S.RemoveButton>
                    </>
                  ) : (
                    <>
                      <S.MedicationName>{med.medicationName}</S.MedicationName>
                      <S.MedicationInfo>
                        {med.medicationUsage} - {med.medicationTakingtime}
                      </S.MedicationInfo>
                    </>
                  )}
                </S.MedicationCard>
              ))}
              {isEditing && (
                <S.AddButton onClick={() => handleAddItem("medication")}>
                  + 약물 추가
                </S.AddButton>
              )}
            </S.MedicationSection>
          )}

          {activeTab === "allergy" && (
            <S.AllergySection>
              {formData.allergy.map((item, idx) => (
                <S.AllergyCard key={idx}>
                  {isEditing ? (
                    <>
                      <S.InputGroup>
                        <S.Label>알레르기 유형</S.Label>
                        <S.Select
                          value={item.allergyType}
                          onChange={(e) => {
                            const updated = [...formData.allergy];
                            updated[idx].allergyType = e.target.value;
                            handleChange("allergy", null, updated);
                          }}>
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
                          value={item.allergyName}
                          onChange={(e) => {
                            const updated = [...formData.allergy];
                            updated[idx].allergyName = e.target.value;
                            handleChange("allergy", null, updated);
                          }}
                          placeholder="알레르기 항목을 입력하세요"
                        />
                      </S.InputGroup>
                      <S.RemoveButton
                        onClick={() => handleRemoveItem("allergy", idx)}>
                        삭제
                      </S.RemoveButton>
                    </>
                  ) : (
                    <>
                      <S.AllergyType>{item.allergyType}</S.AllergyType>
                      <S.AllergyName>{item.allergyName}</S.AllergyName>
                    </>
                  )}
                </S.AllergyCard>
              ))}
              {isEditing && (
                <S.AddButton onClick={() => handleAddItem("allergy")}>
                  + 알레르기 추가
                </S.AddButton>
              )}
            </S.AllergySection>
          )}

          {activeTab === "emergencyPhones" && (
            <S.EmergencySection>
              {formData.emergencyPhones.map((contact, idx) => (
                <S.EmergencyCard key={idx}>
                  {isEditing ? (
                    <>
                      <S.InputGroup>
                        <S.Label>이름</S.Label>
                        <S.Input
                          value={contact.emergencyPhoneName}
                          onChange={(e) => {
                            const updated = [...formData.emergencyPhones];
                            updated[idx].emergencyPhoneName = e.target.value;
                            handleChange("emergencyPhones", null, updated);
                          }}
                          placeholder="이름을 입력하세요"
                        />
                      </S.InputGroup>
                      <S.InputGroup>
                        <S.Label>관계</S.Label>
                        <S.Input
                          value={contact.emergencyPhoneRelationship}
                          onChange={(e) => {
                            const updated = [...formData.emergencyPhones];
                            updated[idx].emergencyPhoneRelationship =
                              e.target.value;
                            handleChange("emergencyPhones", null, updated);
                          }}
                          placeholder="관계를 입력하세요"
                        />
                      </S.InputGroup>
                      <S.InputGroup>
                        <S.Label>전화번호</S.Label>
                        <S.Input
                          type="tel"
                          value={contact.emergencyPhoneNumber}
                          onChange={(e) => {
                            const updated = [...formData.emergencyPhones];
                            updated[idx].emergencyPhoneNumber = e.target.value;
                            handleChange("emergencyPhones", null, updated);
                          }}
                          placeholder="010-0000-0000"
                        />
                      </S.InputGroup>
                      <S.RemoveButton
                        onClick={() =>
                          handleRemoveItem("emergencyPhones", idx)
                        }>
                        삭제
                      </S.RemoveButton>
                    </>
                  ) : (
                    <>
                      <S.EmergencyName>
                        {contact.emergencyPhoneName}
                      </S.EmergencyName>
                      <S.EmergencyRelation>
                        {contact.emergencyPhoneRelationship}
                      </S.EmergencyRelation>
                      <S.EmergencyPhone
                        href={`tel:${contact.emergencyPhoneNumber}`}>
                        {contact.emergencyPhoneNumber}
                      </S.EmergencyPhone>
                    </>
                  )}
                </S.EmergencyCard>
              ))}
              {isEditing && (
                <S.AddButton onClick={() => handleAddItem("emergencyPhones")}>
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
