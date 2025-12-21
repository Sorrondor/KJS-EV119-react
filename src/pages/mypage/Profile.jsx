import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./style";
import { useMyPageLayout } from "./MyPageLayoutContext";

const API_BASE_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:10000";

const Profile = () => {
  const navigate = useNavigate();
  const { setTitle } = useMyPageLayout();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setTitle("회원정보");
    return () => {
      setTitle("마이페이지");
    };
  }, [setTitle]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("member"));
    if (user) {
      setFormData({
        memberName: user.memberName || "-",
        memberEmail: user.memberEmail || "-",
        memberPhone: user.memberPhone || "-",
      });
    }
  }, []);

  const formatPhoneNumber = (phoneNumber) => {
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
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
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
    handleChange({
      target: { name: "memberPhone", value: limitedNumbers },
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.memberName.trim()) {
      newErrors.memberName = "이름을 입력해주세요.";
    }

    if (!formData.memberEmail.trim()) {
      newErrors.memberEmail = "이메일을 입력해주세요.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.memberEmail)) {
      newErrors.memberEmail = "올바른 이메일 형식이 아닙니다.";
    }

    if (!formData.memberPhone.trim()) {
      newErrors.memberPhone = "전화번호를 입력해주세요.";
    } else if (!/^010\d{4}\d{4}$/.test(formData.memberPhone)) {
      newErrors.memberPhone =
        "올바른 전화번호 형식이 아닙니다. (01000000000 숫자만 입력)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateUserData = async (newData) => {
    const response = await fetch(`${API_BASE_URL}/my-page/edit`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify(newData),
    });
    if (!response.ok) {
      throw new Error("회원정보 수정에 실패했습니다.");
    }
    const result = await response.json();
    const updatedUser = result.data;
    localStorage.setItem("member", JSON.stringify(updatedUser));
    return updatedUser;
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }

    try {
      const updatedUser = await updateUserData(formData);
      setFormData({
        memberName: updatedUser.memberName || "-",
        memberEmail: updatedUser.memberEmail || "-",
        memberPhone: updatedUser.memberPhone || "-",
      });
      alert("회원정보가 수정되었습니다.");
      setIsEditing(false);
    } catch (error) {
      alert(error.message || "회원정보 수정에 실패했습니다.");
    }
  };

  const handleCancel = () => {
    const user = JSON.parse(localStorage.getItem("member"));
    if (user) {
      setFormData({
        memberName: user.memberName || "-",
        memberEmail: user.memberEmail || "-",
        memberPhone: user.memberPhone || "-",
      });
    }
    setErrors({});
    setIsEditing(false);
  };

  return (
    <S.FormSection>
      {!isEditing && (
        <S.EditButton onClick={() => setIsEditing(true)}>수정</S.EditButton>
      )}
      <S.InputGroup>
        <S.Label>이름</S.Label>
        {isEditing ? (
          <>
            <S.Input
              type="text"
              name="memberName"
              value={formData.memberName}
              onChange={handleChange}
              placeholder="이름을 입력하세요"
            />
            {errors.memberName && (
              <S.FieldError>{errors.memberName}</S.FieldError>
            )}
          </>
        ) : (
          <S.InfoValue>{formData.memberName}</S.InfoValue>
        )}
      </S.InputGroup>

      <S.InputGroup>
        <S.Label>이메일</S.Label>
        {isEditing ? (
          <>
            <S.Input
              type="email"
              name="memberEmail"
              value={formData.memberEmail}
              onChange={handleChange}
              placeholder="이메일을 입력하세요"
            />
            {errors.memberEmail && (
              <S.FieldError>{errors.memberEmail}</S.FieldError>
            )}
          </>
        ) : (
          <S.InfoValue>{formData.memberEmail}</S.InfoValue>
        )}
      </S.InputGroup>

      <S.InputGroup>
        <S.Label>전화번호</S.Label>
        {isEditing ? (
          <>
            <S.Input
              type="tel"
              name="memberPhone"
              value={formatPhoneNumber(formData.memberPhone || "")}
              onChange={handlePhoneNumberChange}
              placeholder="010-0000-0000"
              maxLength={13}
            />
            {errors.memberPhone && (
              <S.FieldError>{errors.memberPhone}</S.FieldError>
            )}
          </>
        ) : (
          <S.InfoValue>
            {formData.memberPhone
              ? formatPhoneNumber(formData.memberPhone)
              : "-"}
          </S.InfoValue>
        )}
      </S.InputGroup>

      {isEditing && (
        <S.ButtonGroup>
          <S.CancelButton onClick={handleCancel}>취소</S.CancelButton>
          <S.SaveButton onClick={handleSave}>저장</S.SaveButton>
        </S.ButtonGroup>
      )}
    </S.FormSection>
  );
};

export default Profile;
