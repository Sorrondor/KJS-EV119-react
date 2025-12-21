import React from "react";
import { useNavigate } from "react-router-dom";
import * as S from "./style";

const API_BASE_URL =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:10000";

const MyPage = () => {
  const navigate = useNavigate();

  const logOutFunction = async () => {
    const response = await fetch(`${API_BASE_URL}/api/member/logout`, {
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
    const getMemberId = () => {
      const member = JSON.parse(localStorage.getItem("member") || "null");
      return member?.memberId ?? member?.id ?? null
    }

  
    const withdrawFun = async() => {
      const memberId= getMemberId();
      if(!memberId) throw new Error("memberId를 찾을 수 없습니다.");

      const response = await fetch(`${privateUrl}/api/member/withdraw?memberId=${memberId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        credentials: "include",
      });

      const result = await response.json().catch(() => ({}));

      if(!response.ok) {
        const message = result?.message || "회원탈퇴에 실패했습니다.";
        throw new Error(message);
      }

      localStorage.clear();
    };

    const handleWithdraw = () => {
      if(window.confirm("정말 탈퇴하시겠습니까?")) {
        withdrawFun().then(() => {
          alert("탈퇴가 완료되었습니다.");
          navigate("/");
        })
        .catch((error) => {
          console.error(error)
        })
      }
    }
  
  return (
    <>
      <S.MenuSection>
        <S.MenuTitle>계정 관리</S.MenuTitle>
        <S.MenuList>
          <S.MenuItem onClick={() => navigate("/mypage/profile")}>
            <S.MenuIcon>📝</S.MenuIcon>
            <S.MenuText>회원정보 수정</S.MenuText>
            <S.MenuArrow>›</S.MenuArrow>
          </S.MenuItem>
          <S.MenuItem onClick={() => navigate("/mypage/change-password")}>
            <S.MenuIcon>🔒</S.MenuIcon>
            <S.MenuText>비밀번호 변경</S.MenuText>
            <S.MenuArrow>›</S.MenuArrow>
          </S.MenuItem>
        </S.MenuList>
      </S.MenuSection>

      <S.MenuSection>
        <S.MenuTitle>건강정보 관리</S.MenuTitle>
        <S.MenuList>
          <S.MenuItem onClick={() => navigate(`/mypage/health`)}>
            <S.MenuIcon>🏥</S.MenuIcon>
            <S.MenuText>건강정보 조회/수정</S.MenuText>
            <S.MenuArrow>›</S.MenuArrow>
          </S.MenuItem>
          <S.MenuItem
            onClick={() => navigate(`/mypage/health?TabName=medication`)}>
            <S.MenuIcon>💊</S.MenuIcon>
            <S.MenuText>복용 중인 약물</S.MenuText>
            <S.MenuArrow>›</S.MenuArrow>
          </S.MenuItem>
          <S.MenuItem
            onClick={() => navigate(`/mypage/health?TabName=allergy`)}>
            <S.MenuIcon>⚠️</S.MenuIcon>
            <S.MenuText>알레르기 정보</S.MenuText>
            <S.MenuArrow>›</S.MenuArrow>
          </S.MenuItem>
          <S.MenuItem
            onClick={() => navigate(`/mypage/health?TabName=emergencyPhones`)}>
            <S.MenuIcon>📞</S.MenuIcon>
            <S.MenuText>응급연락처</S.MenuText>
            <S.MenuArrow>›</S.MenuArrow>
          </S.MenuItem>
        </S.MenuList>
      </S.MenuSection>

      <S.MenuSection>
        <S.MenuTitle>병원 방문 이력</S.MenuTitle>
        <S.MenuList>
          <S.MenuItem onClick={() => navigate("/mypage/visit-history")}>
            <S.MenuIcon>📋</S.MenuIcon>
            <S.MenuText>과거 병원방문 이력</S.MenuText>
            <S.MenuArrow>›</S.MenuArrow>
          </S.MenuItem>
        </S.MenuList>
      </S.MenuSection>

        <S.LogoutButton onClick={handleLogout}>로그아웃</S.LogoutButton>
        <S.LogoutButton onClick={handleWithdraw}>회원탈퇴</S.LogoutButton>
      </S.Content>
    </S.Container>
  );
};

export default MyPage;
