import styled from 'styled-components';
import { flexCenter, flexCenterColumn } from '../../styles/common';

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #FAFAFA;
  display: flex;
  flex-direction: column;
  padding: 0;
  box-sizing: border-box;
  position: relative;
  overflow-x: hidden;
`;

export const Header = styled.header`
  padding: 60px 24px 40px;
  text-align: center;
  background-color: #FAFAFA;
  backdrop-filter: blur(10px);
`;

export const Logo = styled.h1`
  font-size: 64px;
  font-weight: 800;
  color: #CD0B16;
  margin: 0 0 12px 0;
  letter-spacing: -2px;
  text-shadow: 0 2px 8px rgba(205, 11, 22, 0.15);
`;

export const Subtitle = styled.p`
  font-size: 16px;
  color: #666666;
  margin: 0;
  font-weight: 500;
`;

export const MainContent = styled.main`
  flex: 1;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  box-sizing: border-box;
`;

export const PrimaryActions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const EmergencyButton = styled.button`
  width: 100%;
  min-height: 140px;
  background: linear-gradient(135deg, #CD0B16 0%, #C30D16 50%, #B80F16 100%);
  color: #FFFFFF;
  border: none;
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(195, 13, 22, 0.25);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(195, 13, 22, 0.35);
    
    &::before {
      opacity: 1;
    }
  }
  
  &:active {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(195, 13, 22, 0.3);
  }

  @media (max-width: 768px) {
    min-height: 120px;
    padding: 20px;
  }
`;

export const ButtonIcon = styled.div`
  font-size: 48px;
  line-height: 1;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));

  @media (max-width: 768px) {
    font-size: 40px;
  }
`;

export const ButtonText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

export const ButtonTitle = styled.div`
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

export const ButtonSubtitle = styled.div`
  font-size: 13px;
  font-weight: 400;
  opacity: 0.9;
  line-height: 1.2;
`;

export const SearchSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const SearchLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #CD0B16;
  padding-left: 4px;
`;

export const SearchInput = styled.input`
  width: 100%;
  height: 56px;
  background-color: #FFFFFF;
  color: #333333;
  border: 2px solid rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  padding: 0 20px;
  font-size: 16px;
  font-weight: 400;
  box-sizing: border-box;
  outline: none;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(205, 11, 22, 0.08);

  &::placeholder {
    color: #999999;
  }

  &:focus {
    border-color: rgba(0, 0, 0, 0.3);
    box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.1);
    background-color: #FFF9F9;
  }
`;

export const QuickLinks = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
  justify-content: center;
  flex-wrap: wrap;
`;

export const QuickLinkItem = styled.button`
  flex: 1;
  min-width: 140px;
  height: 56px;
  background-color: #FFFFFF;
  border: 2px solid rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(205, 11, 22, 0.05);

  &:hover {
    border-color: rgba(0, 0, 0, 0.3);
    background-color: #FFF5F5;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(205, 11, 22, 0.15);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    min-width: calc(50% - 6px);
  }
`;

export const LinkIcon = styled.span`
  font-size: 20px;
`;

export const LinkText = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #333333;
`;

export const Footer = styled.footer`
  padding: 24px;
  text-align: center;
  background-color: #FAFAFA;
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
`;

export const FooterText = styled.p`
  font-size: 13px;
  color: #999999;
  margin: 0;
  font-weight: 500;
`;

