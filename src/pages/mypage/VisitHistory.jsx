import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./style";

const VisitHistory = () => {
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [filter, setFilter] = useState("all");

  const [visitHistory, setVisitHistory] = useState([]);

  const [newVisit, setNewVisit] = useState({
    visitedDate: "",
    visitedName: "",
    visitedDepartment: "",
    visitedType: "HOSPITAL",
    visitedReason: "",
    visitedDiagnosis: "",
    visitedTreatmentContent: "",
    visitedDoctor: "",
  });

  const privateUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:10000";

  useEffect(() => {
    const getVisitedList = async () => {
      try {
        const response = await fetch(`${privateUrl}/my-page/visited`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        const result = await response.json();
        if (result.data) {
          setVisitHistory(result.data);
        }
      } catch (error) {
        console.error("Error fetching visit history:", error);
      }
    };
    getVisitedList();
  }, []);

  const handleAdd = async () => {
    if (
      !newVisit.visitedDate ||
      !newVisit.visitedName ||
      !newVisit.visitedDepartment
    ) {
      alert("날짜, 병원명, 진료과를 입력해주세요.");
      return;
    }

    try {
      const response = await fetch(`${privateUrl}/my-page/visited/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(newVisit),
      });

      if (!response.ok) {
        throw new Error("방문 이력 추가에 실패했습니다.");
      }

      const result = await response.json();
      if (result.data) {
        setVisitHistory(result.data);
      }

      setNewVisit({
        visitedDate: "",
        visitedName: "",
        visitedDepartment: "",
        visitedType: "HOSPITAL",
        visitedReason: "",
        visitedDiagnosis: "",
        visitedTreatmentContent: "",
        visitedDoctor: "",
      });
      setIsAdding(false);
      alert("방문 이력이 추가되었습니다.");
    } catch (error) {
      console.error("Error adding visit history:", error);
      alert(error.message || "방문 이력 추가에 실패했습니다.");
    }
  };

  const handleCancel = () => {
    setNewVisit({
      visitedDate: "",
      visitedName: "",
      visitedDepartment: "",
      visitedType: "HOSPITAL",
      visitedReason: "",
      visitedDiagnosis: "",
      visitedTreatmentContent: "",
      visitedDoctor: "",
    });
    setIsAdding(false);
  };

  const handleDelete = async (visit) => {
    if (window.confirm("이 방문 이력을 삭제하시겠습니까?")) {
      try {
        const response = await fetch(`${privateUrl}/my-page/visited/delete`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(visit),
        });

        if (!response.ok) {
          throw new Error("방문 이력 삭제에 실패했습니다.");
        }

        const result = await response.json();
        if (result.data) {
          setVisitHistory(result.data);
        }
        alert("방문 이력이 삭제되었습니다.");
      } catch (error) {
        console.error("Error deleting visit history:", error);
        alert(error.message || "방문 이력 삭제에 실패했습니다.");
      }
    }
  };

  const filteredHistory =
    filter === "all"
      ? visitHistory
      : visitHistory.filter((visit) => visit.visitedType === filter);

  const getTypeLabel = (visitedType) => {
    switch (visitedType) {
      case "EMERGENCY":
        return "응급실";
      case "HOSPITAL":
        return "병원";
      case "CLINIC":
        return "의원";
      default:
        return "";
    }
  };

  const getTypeColor = (visitedType) => {
    switch (visitedType) {
      case "EMERGENCY":
        return "#CD0B16";
      case "HOSPITAL":
        return "#2196F3";
      case "CLINIC":
        return "#4CAF50";
      default:
        return "#666666";
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
            $active={filter === "all"}
            onClick={() => setFilter("all")}>
            전체
          </S.FilterButton>
          <S.FilterButton
            $active={filter === "EMERGENCY"}
            onClick={() => setFilter("EMERGENCY")}>
            응급실
          </S.FilterButton>
          <S.FilterButton
            $active={filter === "HOSPITAL"}
            onClick={() => setFilter("HOSPITAL")}>
            병원
          </S.FilterButton>
          <S.FilterButton
            $active={filter === "CLINIC"}
            onClick={() => setFilter("CLINIC")}>
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
                value={newVisit.visitedDate}
                onChange={(e) =>
                  setNewVisit({ ...newVisit, visitedDate: e.target.value })
                }
              />
            </S.InputGroup>
            <S.InputGroup>
              <S.Label>병원명</S.Label>
              <S.Input
                type="text"
                value={newVisit.visitedName}
                onChange={(e) =>
                  setNewVisit({ ...newVisit, visitedName: e.target.value })
                }
                placeholder="병원명을 입력하세요"
              />
            </S.InputGroup>
            <S.InputGroup>
              <S.Label>진료과</S.Label>
              <S.Input
                type="text"
                value={newVisit.visitedDepartment}
                onChange={(e) =>
                  setNewVisit({
                    ...newVisit,
                    visitedDepartment: e.target.value,
                  })
                }
                placeholder="진료과를 입력하세요"
              />
            </S.InputGroup>
            <S.InputGroup>
              <S.Label>방문 유형</S.Label>
              <S.Select
                value={newVisit.visitedType}
                onChange={(e) =>
                  setNewVisit({ ...newVisit, visitedType: e.target.value })
                }>
                <option value="HOSPITAL">병원</option>
                <option value="CLINIC">의원</option>
                <option value="EMERGENCY">응급실</option>
              </S.Select>
            </S.InputGroup>
            <S.InputGroup>
              <S.Label>방문 사유</S.Label>
              <S.TextArea
                value={newVisit.visitedReason}
                onChange={(e) =>
                  setNewVisit({ ...newVisit, visitedReason: e.target.value })
                }
                placeholder="방문 사유를 입력하세요"
                rows="3"
              />
            </S.InputGroup>
            <S.InputGroup>
              <S.Label>진단명</S.Label>
              <S.Input
                type="text"
                value={newVisit.visitedDiagnosis}
                onChange={(e) =>
                  setNewVisit({ ...newVisit, visitedDiagnosis: e.target.value })
                }
                placeholder="진단명을 입력하세요"
              />
            </S.InputGroup>
            <S.InputGroup>
              <S.Label>치료 내용</S.Label>
              <S.TextArea
                value={newVisit.visitedTreatmentContent}
                onChange={(e) =>
                  setNewVisit({
                    ...newVisit,
                    visitedTreatmentContent: e.target.value,
                  })
                }
                placeholder="치료 내용을 입력하세요"
                rows="3"
              />
            </S.InputGroup>
            <S.InputGroup>
              <S.Label>담당 의사</S.Label>
              <S.Input
                type="text"
                value={newVisit.visitedDoctor}
                onChange={(e) =>
                  setNewVisit({ ...newVisit, visitedDoctor: e.target.value })
                }
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
              {filter === "all"
                ? "방문 이력이 없습니다."
                : "해당 유형의 방문 이력이 없습니다."}
            </S.EmptyMessage>
          ) : (
            filteredHistory.map((visit, index) => (
              <S.HistoryCard key={index}>
                <S.HistoryHeader>
                  <S.HistoryDate>{visit.visitedDate}</S.HistoryDate>
                  <S.TypeBadge $color={getTypeColor(visit.visitedType)}>
                    {getTypeLabel(visit.visitedType)}
                  </S.TypeBadge>
                  <S.DeleteButton onClick={() => handleDelete(visit)}>
                    삭제
                  </S.DeleteButton>
                </S.HistoryHeader>
                <S.HospitalName>{visit.visitedName}</S.HospitalName>
                <S.Department>{visit.visitedDepartment}</S.Department>
                {visit.visitedDoctor && (
                  <S.DoctorInfo>담당의: {visit.visitedDoctor}</S.DoctorInfo>
                )}
                {visit.visitedReason && (
                  <S.InfoRow>
                    <S.InfoLabel>방문 사유:</S.InfoLabel>
                    <S.InfoValue>{visit.visitedReason}</S.InfoValue>
                  </S.InfoRow>
                )}
                {visit.visitedDiagnosis && (
                  <S.InfoRow>
                    <S.InfoLabel>진단명:</S.InfoLabel>
                    <S.InfoValue $highlight>
                      {visit.visitedDiagnosis}
                    </S.InfoValue>
                  </S.InfoRow>
                )}
                {visit.visitedTreatmentContent && (
                  <S.InfoRow>
                    <S.InfoLabel>치료 내용:</S.InfoLabel>
                    <S.InfoValue>{visit.visitedTreatmentContent}</S.InfoValue>
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
