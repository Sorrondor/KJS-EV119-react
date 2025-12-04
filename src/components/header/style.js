import styled from 'styled-components';

export const HeaderContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  padding: 16px 24px;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const LoginButton = styled.button`
  padding: 10px 20px;
  background-color: #FFFFFF;
  color: #CD0B16;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);

  &:hover {
    background-color: #FFF5F5;
    border-color: #CD0B16;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const ProfileContainer = styled.div`
  position: relative;
`;

export const ProfileButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: #FFFFFF;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);

  &:hover {
    background-color: #FAFAFA;
    border-color: rgba(0, 0, 0, 0.2);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const ProfileIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #F5F5F5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
`;

export const ProfileName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #333333;
  white-space: nowrap;
`;

export const DropdownIcon = styled.span`
  font-size: 10px;
  color: #666666;
  transition: transform 0.2s ease;
  transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

export const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 180px;
  background-color: #FFFFFF;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  animation: slideDown 0.2s ease-out;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const MenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 14px;
  color: #333333;

  &:hover {
    background-color: #FAFAFA;
  }

  &:active {
    background-color: #F5F5F5;
  }
`;

export const MenuIcon = styled.span`
  font-size: 16px;
  width: 20px;
  text-align: center;
`;

export const MenuDivider = styled.div`
  height: 1px;
  background-color: rgba(0, 0, 0, 0.08);
  margin: 4px 0;
`;

