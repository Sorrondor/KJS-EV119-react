import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import * as S from "./style";
import { MyPageLayoutProvider, useMyPageLayout } from "./MyPageLayoutContext";

const MyPageLayOutContent = () => {
  const [userData, setUserData] = useState({
    memberName: "-",
    memberEmail: "-",
    memberPhone: "-",
  });
  const navigate = useNavigate();
  const { title, topContent } = useMyPageLayout();
  const API_BASE_URL =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:10000";

  useEffect(() => {
    const getUserData = async () => {
      const response = await fetch(`${API_BASE_URL}/my-page/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      return response.json();
    };
    getUserData()
      .then((data) => {
        if (data?.data) {
          setUserData(data.data);
          return data.data;
        }
      })
      .then((user) => {
        localStorage.setItem("member", JSON.stringify(user));
      })
      .catch((error) => {
        console.error("회원정보 조회에 실패했습니다:", error);
      });
  }, []);

  return (
    <S.Container>
      <S.Header>
        <S.BackButton onClick={() => navigate(-1)}>← 뒤로</S.BackButton>
        <S.Title>{title}</S.Title>
      </S.Header>

      <S.Content>
        {topContent}
        <S.ProfileSection>
          <S.ProfileImage>
            <S.ProfileIcon>👤</S.ProfileIcon>
          </S.ProfileImage>
          <S.ProfileName>{userData.memberName}</S.ProfileName>
          <S.ProfileEmail>{userData.memberEmail}</S.ProfileEmail>
        </S.ProfileSection>
        <Outlet />
      </S.Content>
    </S.Container>
  );
};

const MyPageLayOut = () => {
  return (
    <MyPageLayoutProvider>
      <MyPageLayOutContent />
    </MyPageLayoutProvider>
  );
};

export default MyPageLayOut;
