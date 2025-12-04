import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as S from './style';

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '홍길동',
    email: 'hong@example.com',
    phone: '010-1234-5678'
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    }

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '전화번호를 입력해주세요.';
    } else if (!/^010-\d{4}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = '올바른 전화번호 형식이 아닙니다. (010-0000-0000)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      return;
    }

    // 회원정보 수정 API 호출
    console.log('회원정보 수정:', formData);
    alert('회원정보가 수정되었습니다.');
    setIsEditing(false);
  };

  const handleCancel = () => {
    // 원래 데이터로 복원
    setFormData({
      name: '홍길동',
      email: 'hong@example.com',
      phone: '010-1234-5678'
    });
    setErrors({});
    setIsEditing(false);
  };

  return (
    <S.Container>
      <S.Header>
        <S.BackButton onClick={() => navigate(-1)}>← 뒤로</S.BackButton>
        <S.Title>회원정보</S.Title>
      </S.Header>

      <S.Content>
        <S.ProfileSection>
          <S.ProfileImage>
            <S.ProfileIcon>👤</S.ProfileIcon>
          </S.ProfileImage>
          {!isEditing && (
            <S.EditButton onClick={() => setIsEditing(true)}>
              수정
            </S.EditButton>
          )}
        </S.ProfileSection>

        <S.FormSection>
          <S.InputGroup>
            <S.Label>이름</S.Label>
            {isEditing ? (
              <>
                <S.Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="이름을 입력하세요"
                />
                {errors.name && <S.FieldError>{errors.name}</S.FieldError>}
              </>
            ) : (
              <S.InfoValue>{formData.name}</S.InfoValue>
            )}
          </S.InputGroup>

          <S.InputGroup>
            <S.Label>이메일</S.Label>
            {isEditing ? (
              <>
                <S.Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="이메일을 입력하세요"
                />
                {errors.email && <S.FieldError>{errors.email}</S.FieldError>}
              </>
            ) : (
              <S.InfoValue>{formData.email}</S.InfoValue>
            )}
          </S.InputGroup>

          <S.InputGroup>
            <S.Label>전화번호</S.Label>
            {isEditing ? (
              <>
                <S.Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="010-0000-0000"
                />
                {errors.phone && <S.FieldError>{errors.phone}</S.FieldError>}
              </>
            ) : (
              <S.InfoValue>{formData.phone}</S.InfoValue>
            )}
          </S.InputGroup>

          {isEditing && (
            <S.ButtonGroup>
              <S.CancelButton onClick={handleCancel}>취소</S.CancelButton>
              <S.SaveButton onClick={handleSave}>저장</S.SaveButton>
            </S.ButtonGroup>
          )}
        </S.FormSection>
      </S.Content>
    </S.Container>
  );
};

export default Profile;

