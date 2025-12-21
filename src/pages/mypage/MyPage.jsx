import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./style";

const MyPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    memberName: "-",
    memberEmail: "-",
    memberPhone: "-",
  });

  const privateUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:10000";

  useEffect(() => {
    const getUserData = async () => {
      const response = await fetch(`${privateUrl}/my-page/me`, {
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

  const logOutFunction = async () => {
    const response = await fetch(`${privateUrl}/api/member/logout`, {
      method: "DELETE",
      credentials: "include",
    });
    localStorage.clear();
    if (!response.ok) {
      throw new Error("로그아웃에 실패했습니다.");
    }
  };

  const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      logOutFunction().then(() => {
        navigate("/");
      });
    }
  };

  return (
    <S.Container>
      <S.Header>
        <S.BackButton onClick={() => navigate(-1)}>← 뒤로</S.BackButton>
        <S.Title>마이페이지</S.Title>
      </S.Header>

      <S.Content>
        <S.ProfileSection>
          <S.ProfileImage>
            <S.ProfileIcon>👤</S.ProfileIcon>
          </S.ProfileImage>
          <S.ProfileName>{userData.memberName}</S.ProfileName>
          <S.ProfileEmail>{userData.memberEmail}</S.ProfileEmail>
        </S.ProfileSection>

        <S.MenuSection>
          <S.MenuTitle>계정 관리</S.MenuTitle>
          <S.MenuList>
            <S.MenuItem onClick={() => navigate("/main/profile")}>
              <S.MenuIcon>📝</S.MenuIcon>
              <S.MenuText>회원정보 수정</S.MenuText>
              <S.MenuArrow>›</S.MenuArrow>
            </S.MenuItem>
            <S.MenuItem onClick={() => navigate("/main/profile")}>
              <S.MenuIcon>🔒</S.MenuIcon>
              <S.MenuText>비밀번호 변경</S.MenuText>
              <S.MenuArrow>›</S.MenuArrow>
            </S.MenuItem>
          </S.MenuList>
        </S.MenuSection>

        <S.MenuSection>
          <S.MenuTitle>건강정보 관리</S.MenuTitle>
          <S.MenuList>
            <S.MenuItem onClick={() => navigate(`/main/health`)}>
              <S.MenuIcon>🏥</S.MenuIcon>
              <S.MenuText>건강정보 조회/수정</S.MenuText>
              <S.MenuArrow>›</S.MenuArrow>
            </S.MenuItem>
            <S.MenuItem
              onClick={() => navigate(`/main/health?TabName=medication`)}>
              <S.MenuIcon>💊</S.MenuIcon>
              <S.MenuText>복용 중인 약물</S.MenuText>
              <S.MenuArrow>›</S.MenuArrow>
            </S.MenuItem>
            <S.MenuItem
              onClick={() => navigate(`/main/health?TabName=allergy`)}>
              <S.MenuIcon>⚠️</S.MenuIcon>
              <S.MenuText>알레르기 정보</S.MenuText>
              <S.MenuArrow>›</S.MenuArrow>
            </S.MenuItem>
            <S.MenuItem
              onClick={() => navigate(`/main/health?TabName=emergencyPhones`)}>
              <S.MenuIcon>📞</S.MenuIcon>
              <S.MenuText>응급연락처</S.MenuText>
              <S.MenuArrow>›</S.MenuArrow>
            </S.MenuItem>
          </S.MenuList>
        </S.MenuSection>

        <S.MenuSection>
          <S.MenuTitle>병원 방문 이력</S.MenuTitle>
          <S.MenuList>
            <S.MenuItem onClick={() => navigate("/main/visit-history")}>
              <S.MenuIcon>📋</S.MenuIcon>
              <S.MenuText>과거 병원방문 이력</S.MenuText>
              <S.MenuArrow>›</S.MenuArrow>
            </S.MenuItem>
          </S.MenuList>
        </S.MenuSection>

        <S.LogoutButton onClick={handleLogout}>로그아웃</S.LogoutButton>
      </S.Content>
    </S.Container>
  );
};

export default MyPage;
