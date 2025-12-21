import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as S from "./style";
import { useMyPageLayout } from "./MyPageLayoutContext";

const API_BASE_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:10000";

const BLOOD_RH_OPTIONS = [
  { value: "", label: "선택하세요" },
  { value: "RH+", label: "RH+" },
  { value: "RH-", label: "RH-" },
];

const BLOOD_ABO_OPTIONS = [
  { value: "", label: "선택하세요" },
  { value: "A", label: "A형" },
  { value: "B", label: "B형" },
  { value: "AB", label: "AB형" },
  { value: "O", label: "O형" },
];

const ALLERGY_TYPE_OPTIONS = [
  { value: "", label: "선택하세요" },
  { value: "약물", label: "약물" },
  { value: "음식", label: "음식" },
  { value: "환경", label: "환경" },
  { value: "기타", label: "기타" },
];

const TABS = [
  { id: "basic", label: "기본정보", icon: "🏥" },
  { id: "medication", label: "복용약물", icon: "💊" },
  { id: "allergy", label: "알레르기", icon: "⚠️" },
  { id: "emergencyPhones", label: "응급연락처", icon: "📞" },
];

const HealthInfo = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setTitle, setTopContent } = useMyPageLayout();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    const tabFromUrl = searchParams.get("TabName");
    return tabFromUrl && TABS.some((tab) => tab.id === tabFromUrl)
      ? tabFromUrl
      : "basic";
  });
  const [healthData, setHealthData] = useState({
    basic: {
      bloodRh: "-",
      bloodAbo: "",
      height: "",
      weight: "",
      diseases: [],
    },
    medication: [],
    allergy: [],
    emergencyPhones: [],
  });

  const [formData, setFormData] = useState(healthData);

  const getHeaders = useCallback(() => {
    const token = localStorage.getItem("accessToken");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }, []);

  const filterEmptyItems = useCallback((items, nameField) => {
    if (!Array.isArray(items)) return [];
    return items.filter(
      (item) =>
        item &&
        item[nameField] &&
        String(item[nameField]).trim() !== "" &&
        item[nameField] !== "-"
    );
  }, []);

  const convertBloodRhToBackend = useCallback((rh) => {
    const mapping = { "RH+": "PLUS", "RH-": "MINUS" };
    return mapping[rh] || null;
  }, []);

  const convertBloodRhFromBackend = useCallback((rh) => {
    const mapping = { PLUS: "RH+", MINUS: "RH-" };
    return mapping[rh] || "-";
  }, []);

  const convertAllergyTypeToBackend = useCallback((type) => {
    const mapping = {
      약물: "MEDICINE",
      음식: "FOOD",
      환경: "ENVIRONMENT",
      기타: "OTHER",
    };
    return mapping[type] || null;
  }, []);

  const convertAllergyTypeFromBackend = useCallback((type) => {
    const mapping = {
      MEDICINE: "약물",
      FOOD: "음식",
      ENVIRONMENT: "환경",
      OTHER: "기타",
    };
    return mapping[type] || "";
  }, []);

  const extractDiseaseName = useCallback((disease) => {
    if (!disease) return "";
    if (typeof disease === "string") return disease;
    return disease.diseaseName || "";
  }, []);

  const createDiseaseObject = useCallback((disease) => {
    if (typeof disease === "string") {
      return disease;
    }
    if (typeof disease === "object" && disease !== null) {
      return {
        id: disease.id || null,
        diseaseName: disease.diseaseName || "",
        healthId: disease.healthId || null,
      };
    }
    return "";
  }, []);

  const formatPhoneNumber = useCallback((phoneNumber) => {
    if (!phoneNumber) return "";
    const numbers = phoneNumber.replace(/\D/g, "");
    if (numbers.length === 0) return "";

    const limitedNumbers = numbers.slice(0, 11);

    if (limitedNumbers.length <= 3) {
      return limitedNumbers;
    } else if (limitedNumbers.length <= 7) {
      return `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(3)}`;
    } else {
      return `${limitedNumbers.slice(0, 3)}-${limitedNumbers.slice(
        3,
        7
      )}-${limitedNumbers.slice(7)}`;
    }
  }, []);

  const extractPhoneNumbers = useCallback((phoneNumber) => {
    if (!phoneNumber) return "";
    return phoneNumber.replace(/\D/g, "");
  }, []);

  const handleChange = useCallback((section, field, value) => {
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
  }, []);

  const handleUpdateItem = useCallback((section, index, field, value) => {
    setFormData((prev) => {
      const updated = prev[section].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      );
      return {
        ...prev,
        [section]: updated,
      };
    });
  }, []);

  const handlePhoneNumberChange = useCallback(
    (section, index, value) => {
      const numbers = value.replace(/\D/g, "");

      if (numbers.length > 0) {
        if (!numbers.startsWith("0")) {
          return;
        }
        if (numbers.length >= 3 && !numbers.startsWith("010")) {
          return;
        }
      }

      const limitedNumbers = numbers.slice(0, 11);
      handleUpdateItem(section, index, "emergencyPhoneNumber", limitedNumbers);
    },
    [handleUpdateItem]
  );

  const handleAddItem = useCallback((section) => {
    const itemTemplates = {
      medication: {
        medicationName: "",
        medicationUsage: "",
        medicationTakingtime: "",
      },
      allergy: { allergyType: "", allergyName: "" },
      emergencyPhones: {
        emergencyPhoneName: "",
        emergencyPhoneRelationship: "",
        emergencyPhoneNumber: "",
      },
    };

    setFormData((prev) => ({
      ...prev,
      [section]: [...prev[section], itemTemplates[section]],
    }));
  }, []);

  const handleRemoveItem = useCallback((section, index) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  }, []);

  const apiCall = useCallback(
    async (endpoint, method = "GET", body = null) => {
      const options = {
        method,
        headers: getHeaders(),
      };

      if (body && method !== "GET") {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
      if (!response.ok) {
        throw new Error(`API 호출 실패: ${endpoint}`);
      }
      return response.json();
    },
    [getHeaders]
  );

  const saveBasicHealthInfo = useCallback(async () => {
    const { diseases, ...healthBasic } = formData.basic;
    const healthDataForBackend = {
      healthBloodRh: convertBloodRhToBackend(healthBasic.bloodRh),
      healthBloodAbo: healthBasic.bloodAbo || null,
      healthHeight: healthBasic.height ? parseFloat(healthBasic.height) : null,
      healthWeight: healthBasic.weight ? parseFloat(healthBasic.weight) : null,
    };

    console.log("[전송] 건강 기본정보:", healthDataForBackend);
    await apiCall("/my-page/health/modify", "POST", healthDataForBackend);
  }, [formData.basic, convertBloodRhToBackend, apiCall]);

  const saveDiseases = useCallback(async () => {
    const currentDiseases = healthData.basic?.diseases || [];
    const formDiseases = formData.basic.diseases || [];

    const currentDiseaseNames = currentDiseases
      .map(extractDiseaseName)
      .filter(Boolean);
    const formDiseaseNames = formDiseases
      .map(extractDiseaseName)
      .filter(Boolean);

    const newDiseases = formDiseaseNames.filter(
      (name) => !currentDiseaseNames.includes(name)
    );

    for (const diseaseName of newDiseases) {
      try {
        await apiCall(
          `/my-page/health/add-disease?diseaseName=${encodeURIComponent(
            diseaseName
          )}`,
          "POST"
        );
      } catch (error) {
        console.warn(`기저질환 "${diseaseName}" 추가 실패:`, error);
      }
    }

    const deletedDiseases = currentDiseases.filter((disease) => {
      const diseaseName = extractDiseaseName(disease);
      return diseaseName && !formDiseaseNames.includes(diseaseName);
    });

    for (const disease of deletedDiseases) {
      try {
        const diseaseDTO = {
          id: typeof disease === "object" && disease.id ? disease.id : null,
          diseaseName: extractDiseaseName(disease),
          healthId:
            typeof disease === "object" && disease.healthId
              ? disease.healthId
              : null,
        };
        await apiCall("/my-page/health/remove-disease", "DELETE", diseaseDTO);
      } catch (error) {
        const diseaseName = extractDiseaseName(disease);
        console.warn(`기저질환 "${diseaseName}" 삭제 실패:`, error);
      }
    }
  }, [
    healthData.basic?.diseases,
    formData.basic.diseases,
    extractDiseaseName,
    apiCall,
  ]);

  const saveMedications = useCallback(async () => {
    const medicationList = filterEmptyItems(
      formData.medication,
      "medicationName"
    ).map((med) => ({
      id: med.id || undefined,
      medicationName: med.medicationName,
      medicationUsage: med.medicationUsage || "",
      medicationTakingtime: med.medicationTakingtime || "",
    }));

    console.log("[전송] 복용약물:", medicationList);
    await apiCall("/my-page/medication/modify", "POST", medicationList);
  }, [formData.medication, filterEmptyItems, apiCall]);

  const saveAllergies = useCallback(async () => {
    const allergyList = filterEmptyItems(formData.allergy, "allergyName").map(
      (allergy) => ({
        id: allergy.id || undefined,
        allergyType: convertAllergyTypeToBackend(allergy.allergyType),
        allergyName: allergy.allergyName,
      })
    );

    console.log("[전송] 알레르기:", allergyList);
    await apiCall("/my-page/allergy/modify", "POST", allergyList);
  }, [
    formData.allergy,
    filterEmptyItems,
    convertAllergyTypeToBackend,
    apiCall,
  ]);

  const saveEmergencyPhones = useCallback(async () => {
    const emergencyList = filterEmptyItems(
      formData.emergencyPhones,
      "emergencyPhoneName"
    ).map((contact) => ({
      id: contact.id || undefined,
      emergencyPhoneName: contact.emergencyPhoneName,
      emergencyPhoneRelationship: contact.emergencyPhoneRelationship || "",
      emergencyPhoneNumber: contact.emergencyPhoneNumber || "",
    }));

    console.log("[전송] 응급연락처:", emergencyList);
    await apiCall("/my-page/emergency-phone/modify", "POST", emergencyList);
  }, [formData.emergencyPhones, filterEmptyItems, apiCall]);

  const fetchAllData = useCallback(async () => {
    try {
      const [healthResult, medicationResult, allergyResult, emergencyResult] =
        await Promise.all([
          apiCall("/my-page/health"),
          apiCall("/my-page/medication"),
          apiCall("/my-page/allergy"),
          apiCall("/my-page/emergency-phone"),
        ]);

      const healthDataRaw = healthResult.data || {};
      const medicationsRaw = medicationResult.data || [];
      const allergiesRaw = allergyResult.data || [];
      const emergencyPhonesRaw = emergencyResult.data || [];

      const healthBasic = {
        bloodRh: convertBloodRhFromBackend(healthDataRaw.healthBloodRh),
        bloodAbo: healthDataRaw.healthBloodAbo || "",
        height: healthDataRaw.healthHeight
          ? String(healthDataRaw.healthHeight)
          : "",
        weight: healthDataRaw.healthWeight
          ? String(healthDataRaw.healthWeight)
          : "",
        diseases: (healthDataRaw.diseases || []).map(createDiseaseObject),
      };

      const medications = filterEmptyItems(medicationsRaw, "medicationName");

      const allergies = filterEmptyItems(allergiesRaw, "allergyName").map(
        (allergy) => ({
          ...allergy,
          allergyType: convertAllergyTypeFromBackend(allergy.allergyType),
        })
      );

      const emergencyPhones = filterEmptyItems(
        emergencyPhonesRaw,
        "emergencyPhoneName"
      );

      const allData = {
        basic: healthBasic,
        medication: medications,
        allergy: allergies,
        emergencyPhones: emergencyPhones,
      };

      console.log("[수신] 건강정보:", allData);

      setHealthData(allData);
      setFormData(allData);
    } catch (error) {
      console.error("건강정보 불러오기 중 오류:", error);
      alert("건강정보를 불러오는 중 오류가 발생했습니다.");
    }
  }, [
    apiCall,
    convertBloodRhFromBackend,
    convertAllergyTypeFromBackend,
    filterEmptyItems,
    createDiseaseObject,
  ]);

  const handleSave = useCallback(async () => {
    try {
      await saveBasicHealthInfo();
      await saveDiseases();
      await saveMedications();
      await saveAllergies();
      await saveEmergencyPhones();

      alert("건강정보가 저장되었습니다.");
      setIsEditing(false);
      await fetchAllData();
    } catch (error) {
      console.error("건강정보 저장 중 오류:", error);
      alert(`건강정보 저장에 실패했습니다: ${error.message}`);
    }
  }, [
    saveBasicHealthInfo,
    saveDiseases,
    saveMedications,
    saveAllergies,
    saveEmergencyPhones,
    fetchAllData,
  ]);

  const handleCancel = useCallback(() => {
    const cleanedHealthData = {
      ...healthData,
      medication: filterEmptyItems(
        healthData.medication || [],
        "medicationName"
      ),
      allergy: filterEmptyItems(healthData.allergy || [], "allergyName"),
      emergencyPhones: filterEmptyItems(
        healthData.emergencyPhones || [],
        "emergencyPhoneName"
      ),
    };
    setFormData(cleanedHealthData);
    setIsEditing(false);
  }, [healthData, filterEmptyItems]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  useEffect(() => {
    setTitle("건강정보 관리");
    setTopContent(
      <S.TabContainer>
        {TABS.map((tab) => (
          <S.Tab
            key={tab.id}
            $active={activeTab === tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              navigate(`/mypage/health?TabName=${tab.id}`, { replace: true });
            }}>
            <S.TabIcon>{tab.icon}</S.TabIcon>
            <S.TabLabel>{tab.label}</S.TabLabel>
          </S.Tab>
        ))}
      </S.TabContainer>
    );
    return () => {
      setTitle("마이페이지");
      setTopContent(null);
    };
  }, [setTitle, setTopContent, activeTab, navigate]);

  useEffect(() => {
    const tabFromUrl = searchParams.get("TabName");
    if (tabFromUrl && TABS.some((tab) => tab.id === tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  return (
    <>
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
                    value={formData.basic.bloodRh || ""}
                    onChange={(e) =>
                      handleChange("basic", "bloodRh", e.target.value)
                    }>
                    {BLOOD_RH_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </S.Select>
                  <S.Select
                    value={formData.basic.bloodAbo || ""}
                    onChange={(e) =>
                      handleChange("basic", "bloodAbo", e.target.value)
                    }>
                    {BLOOD_ABO_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </S.Select>
                </>
              ) : (
                <S.InfoValue>
                  {formData.basic.bloodRh !== "-" && formData.basic.bloodAbo
                    ? `${formData.basic.bloodRh} ${formData.basic.bloodAbo}형`
                    : "미등록"}
                </S.InfoValue>
              )}
            </S.InputGroup>

            <S.InputGroup>
              <S.Label>키 (cm)</S.Label>
              {isEditing ? (
                <S.Input
                  type="number"
                  value={formData.basic.height || ""}
                  onChange={(e) =>
                    handleChange("basic", "height", e.target.value)
                  }
                  placeholder="키를 입력하세요"
                />
              ) : (
                <S.InfoValue>
                  {formData.basic.height
                    ? `${formData.basic.height} cm`
                    : "미등록"}
                </S.InfoValue>
              )}
            </S.InputGroup>

            <S.InputGroup>
              <S.Label>몸무게 (kg)</S.Label>
              {isEditing ? (
                <S.Input
                  type="number"
                  value={formData.basic.weight || ""}
                  onChange={(e) =>
                    handleChange("basic", "weight", e.target.value)
                  }
                  placeholder="몸무게를 입력하세요"
                />
              ) : (
                <S.InfoValue>
                  {formData.basic.weight
                    ? `${formData.basic.weight} kg`
                    : "미등록"}
                </S.InfoValue>
              )}
            </S.InputGroup>

            <S.InputGroup>
              <S.Label>기저질환</S.Label>
              {isEditing && (
                <S.TagInput
                  type="text"
                  placeholder="기저질환을 입력하고 Enter를 누르세요"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const value = e.target.value.trim();
                      if (value) {
                        const existingNames =
                          formData.basic.diseases.map(extractDiseaseName);
                        if (!existingNames.includes(value)) {
                          handleChange("basic", "diseases", [
                            ...formData.basic.diseases,
                            value,
                          ]);
                          e.target.value = "";
                        } else {
                          alert("이미 등록된 기저질환입니다.");
                        }
                      }
                    }
                  }}
                />
              )}
              <S.TagContainer>
                {formData.basic.diseases.length === 0 && !isEditing ? (
                  <S.EmptyMessage>등록된 기저질환이 없습니다.</S.EmptyMessage>
                ) : (
                  formData.basic.diseases.map((disease, idx) => {
                    const diseaseName = extractDiseaseName(disease);
                    return (
                      <S.Tag
                        key={
                          typeof disease === "object" && disease.id
                            ? `disease-${disease.id}`
                            : `disease-new-${idx}`
                        }>
                        {diseaseName}
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
                    );
                  })
                )}
              </S.TagContainer>
            </S.InputGroup>
          </S.BasicInfoSection>
        )}

        {activeTab === "medication" && (
          <S.MedicationSection>
            {formData.medication.length === 0 && !isEditing ? (
              <S.EmptyMessage>등록된 복용약물이 없습니다.</S.EmptyMessage>
            ) : (
              formData.medication.map((med, idx) => (
                <S.MedicationCard key={med.id || `med-${idx}`}>
                  {isEditing ? (
                    <>
                      <S.InputGroup>
                        <S.Label>약물명</S.Label>
                        <S.Input
                          value={med.medicationName || ""}
                          onChange={(e) =>
                            handleUpdateItem(
                              "medication",
                              idx,
                              "medicationName",
                              e.target.value
                            )
                          }
                          placeholder="약물명을 입력하세요"
                        />
                      </S.InputGroup>
                      <S.InputGroup>
                        <S.Label>용법</S.Label>
                        <S.Input
                          value={med.medicationUsage || ""}
                          onChange={(e) =>
                            handleUpdateItem(
                              "medication",
                              idx,
                              "medicationUsage",
                              e.target.value
                            )
                          }
                          placeholder="예: 1일 1회"
                        />
                      </S.InputGroup>
                      <S.InputGroup>
                        <S.Label>복용시간</S.Label>
                        <S.Input
                          value={med.medicationTakingtime || ""}
                          onChange={(e) =>
                            handleUpdateItem(
                              "medication",
                              idx,
                              "medicationTakingtime",
                              e.target.value
                            )
                          }
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
              ))
            )}
            {isEditing && (
              <S.AddButton onClick={() => handleAddItem("medication")}>
                + 약물 추가
              </S.AddButton>
            )}
          </S.MedicationSection>
        )}

        {activeTab === "allergy" && (
          <S.AllergySection>
            {formData.allergy.length === 0 && !isEditing ? (
              <S.EmptyMessage>등록된 알레르기가 없습니다.</S.EmptyMessage>
            ) : (
              formData.allergy.map((item, idx) => (
                <S.AllergyCard key={item.id || `allergy-${idx}`}>
                  {isEditing ? (
                    <>
                      <S.InputGroup>
                        <S.Label>알레르기 유형</S.Label>
                        <S.Select
                          value={item.allergyType || ""}
                          onChange={(e) =>
                            handleUpdateItem(
                              "allergy",
                              idx,
                              "allergyType",
                              e.target.value
                            )
                          }>
                          {ALLERGY_TYPE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </S.Select>
                      </S.InputGroup>
                      <S.InputGroup>
                        <S.Label>알레르기 항목</S.Label>
                        <S.Input
                          value={item.allergyName || ""}
                          onChange={(e) =>
                            handleUpdateItem(
                              "allergy",
                              idx,
                              "allergyName",
                              e.target.value
                            )
                          }
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
                      <S.AllergyType>
                        {item.allergyType || "미분류"}
                      </S.AllergyType>
                      <S.AllergyName>{item.allergyName}</S.AllergyName>
                    </>
                  )}
                </S.AllergyCard>
              ))
            )}
            {isEditing && (
              <S.AddButton onClick={() => handleAddItem("allergy")}>
                + 알레르기 추가
              </S.AddButton>
            )}
          </S.AllergySection>
        )}

        {activeTab === "emergencyPhones" && (
          <S.EmergencySection>
            {formData.emergencyPhones.length === 0 && !isEditing ? (
              <S.EmptyMessage>등록된 응급연락처가 없습니다.</S.EmptyMessage>
            ) : (
              formData.emergencyPhones.map((contact, idx) => (
                <S.EmergencyCard key={contact.id || `emergency-${idx}`}>
                  {isEditing ? (
                    <>
                      <S.InputGroup>
                        <S.Label>이름</S.Label>
                        <S.Input
                          value={contact.emergencyPhoneName || ""}
                          onChange={(e) =>
                            handleUpdateItem(
                              "emergencyPhones",
                              idx,
                              "emergencyPhoneName",
                              e.target.value
                            )
                          }
                          placeholder="이름을 입력하세요"
                        />
                      </S.InputGroup>
                      <S.InputGroup>
                        <S.Label>관계</S.Label>
                        <S.Input
                          value={contact.emergencyPhoneRelationship || ""}
                          onChange={(e) =>
                            handleUpdateItem(
                              "emergencyPhones",
                              idx,
                              "emergencyPhoneRelationship",
                              e.target.value
                            )
                          }
                          placeholder="관계를 입력하세요"
                        />
                      </S.InputGroup>
                      <S.InputGroup>
                        <S.Label>전화번호</S.Label>
                        <S.Input
                          type="tel"
                          value={formatPhoneNumber(
                            contact.emergencyPhoneNumber || ""
                          )}
                          onChange={(e) =>
                            handlePhoneNumberChange(
                              "emergencyPhones",
                              idx,
                              e.target.value
                            )
                          }
                          placeholder="010-0000-0000"
                          maxLength={13}
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
                        href={`tel:${extractPhoneNumbers(
                          contact.emergencyPhoneNumber
                        )}`}>
                        {formatPhoneNumber(contact.emergencyPhoneNumber || "")}
                      </S.EmergencyPhone>
                    </>
                  )}
                </S.EmergencyCard>
              ))
            )}
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
    </>
  );
};

export default HealthInfo;
