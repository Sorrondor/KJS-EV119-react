import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as S from './style';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:10000';

const UserHeader = () => {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  // 임시 로그인 상태 (실제로는 Redux나 Context에서 가져옴)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [userData, setUserData] = useState(null);
  
  useEffect(() => {
  const storedLogin = localStorage.getItem("isLoggedIn");
  const storedUser = localStorage.getItem("member");

  console.log("storedLogin", storedLogin);
  console.log("storedUser", storedUser);

  if (storedLogin === "true" && storedUser) {
    try {
      const parsed = JSON.parse(storedUser);
      console.log("user parsed:", parsed);

      if (parsed && Object.keys(parsed).length > 0) {
        setIsLoggedIn(true);
        setUserData(parsed);
      } else {
        console.warn("member is empty object, ignoring");
      }
    } catch (e) {
      console.error("failed to parse member", e);
    }
  }
}, []);

  const handleLogin = () => {
    navigate('/auth/login');
  };

  const handleProfile = () => {
    navigate('/main/mypage');
    setShowMenu(false);
  };
  

  const handleLogout = async () => {
  if (!window.confirm('로그아웃 하시겠습니까?')) return;

  const accessToken = localStorage.getItem('accessToken'); 

  try {
    await fetch(`${BACKEND_URL}/api/member/logout`, {
      method: "DELETE", 
      headers: {
        ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
  } catch (e) {
    console.error('logout api error', e);
  } finally {
    
    localStorage.removeItem('accessToken');
    localStorage.removeItem('member');
    localStorage.setItem('isLoggedIn', 'false');

    setIsLoggedIn(false);
    setUserData(null);
    setShowMenu(false);

    navigate('/');
  }
};



  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  return (
    <S.HeaderContainer ref={menuRef}>
      {!isLoggedIn ? (
        <S.LoginButton onClick={handleLogin}>
          로그인
        </S.LoginButton>
      ) : (
        <S.ProfileContainer>
          <S.ProfileButton onClick={() => setShowMenu(!showMenu)}>
            <S.ProfileIcon>👤</S.ProfileIcon>
            <S.ProfileName>{userData?.memberName}</S.ProfileName>
            <S.DropdownIcon $isOpen={showMenu}>▼</S.DropdownIcon>
          </S.ProfileButton>
          {showMenu && (
            <S.DropdownMenu>
              <S.MenuItem onClick={handleProfile}>
                <S.MenuIcon>👤</S.MenuIcon>
                마이페이지
              </S.MenuItem>
              <S.MenuItem onClick={() => { navigate('/main/profile'); setShowMenu(false); }}>
                <S.MenuIcon>📝</S.MenuIcon>
                회원정보 수정
              </S.MenuItem>
              <S.MenuDivider />
              <S.MenuItem onClick={handleLogout}>
                <S.MenuIcon>🚪</S.MenuIcon>
                로그아웃
              </S.MenuItem>
            </S.DropdownMenu>
          )}
        </S.ProfileContainer>
      )}
    </S.HeaderContainer>
  );
};

export default UserHeader;

