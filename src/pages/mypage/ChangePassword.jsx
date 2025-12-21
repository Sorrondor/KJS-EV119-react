import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./style";
import { useMyPageLayout } from "./MyPageLayoutContext";

const API_BASE_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:10000";

const ChangePassword = () => {
  const navigate = useNavigate();
  const { setTitle } = useMyPageLayout();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setTitle("비밀번호 변경");
    return () => setTitle("마이페이지");
  }, [setTitle]);

  const handleSubmit = async () => {
    setError("");
    setInfo("");

    if (!currentPassword || !newPassword || !newPassword2) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    if (newPassword.length < 8) {
      setError("비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }

    if (newPassword !== newPassword2) {
      setError("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    if (currentPassword === newPassword) {
      setError("현재 비밀번호와 새 비밀번호가 같습니다.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(`${API_BASE_URL}/my-page/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      let result = null;
      try {
        result = await response.json();
      } catch {
        result = null;
      }

      if (!response.ok) {
        setError(result?.message || "비밀번호 변경에 실패했습니다.");
        return;
      }

      setInfo(result?.message || "비밀번호가 변경되었습니다.");
      setTimeout(() => {
        navigate("/mypage", { replace: true });
      }, 1500);
    } catch (e) {
      console.error(e);
      setError("서버 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <S.FormSection>
      <S.InputGroup>
        <S.Label>현재 비밀번호</S.Label>
        <S.Input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="현재 비밀번호를 입력하세요"
          autoComplete="current-password"
          disabled={isLoading}
        />
      </S.InputGroup>

      <S.InputGroup>
        <S.Label>새 비밀번호</S.Label>
        <S.Input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="8자 이상 입력"
          autoComplete="new-password"
          disabled={isLoading}
        />
      </S.InputGroup>

      <S.InputGroup>
        <S.Label>새 비밀번호 확인</S.Label>
        <S.Input
          type="password"
          value={newPassword2}
          onChange={(e) => setNewPassword2(e.target.value)}
          placeholder="비밀번호를 다시 입력하세요"
          autoComplete="new-password"
          disabled={isLoading}
        />
      </S.InputGroup>

      {error && <S.ErrorMessage>{error}</S.ErrorMessage>}
      {info && <S.InfoMessage>{info}</S.InfoMessage>}

      <S.ButtonGroup>
        <S.CancelButton
          type="button"
          onClick={() => navigate(-1)}
          disabled={isLoading}>
          취소
        </S.CancelButton>
        <S.SaveButton type="button" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "변경 중..." : "비밀번호 변경"}
        </S.SaveButton>
      </S.ButtonGroup>
    </S.FormSection>
  );
};

export default ChangePassword;
