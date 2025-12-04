import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as S from './style';

const UserHeader = () => {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  // 임시 로그인 상태 (실제로는 Redux나 Context에서 가져옴)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  // 임시 사용자 데이터
  const userData = {
    name: '홍길동',
    email: 'hong@example.com'
  };

  const handleLogin = () => {
    navigate('/auth/login');
  };

  const handleProfile = () => {
    navigate('/main/mypage');
    setShowMenu(false);
  };

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      setIsLoggedIn(false);
      setShowMenu(false);
      // 실제로는 로그아웃 API 호출
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
            <S.ProfileName>{userData.name}</S.ProfileName>
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

