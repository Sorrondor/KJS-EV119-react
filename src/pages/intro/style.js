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
  padding: 40px 24px 100px 24px;
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
  gap: 16px;
`;

export const SearchLabel = styled.label`
  font-size: 15px;
  font-weight: 500;
  color: #333333;
  padding-left: 2px;
`;

export const SearchInputWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
`;

export const SearchInput = styled.input`
  width: 100%;
  height: 52px;
  background-color: #FFFFFF;
  color: #333333;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 10px;
  padding: 0 60px 0 18px;
  font-size: 15px;
  font-weight: 400;
  box-sizing: border-box;
  outline: none;
  transition: all 0.2s ease;

  &::placeholder {
    color: #999999;
  }

  &:focus {
    border-color: rgba(0, 0, 0, 0.25);
    background-color: #FAFAFA;
  }
`;

export const VoiceButton = styled.button`
  position: absolute;
  right: 6px;
  width: 40px;
  height: 40px;
  background-color: ${props => props.$isListening ? '#CD0B16' : 'transparent'};
  color: ${props => props.$isListening ? '#FFFFFF' : '#666666'};
  border: none;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.$isListening ? '#B80F16' : 'rgba(0, 0, 0, 0.05)'};
  }

  &:active {
    transform: scale(0.95);
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }

  ${props => props.$isListening && `
    animation: pulse 1.5s ease-in-out infinite;
  `}
`;

export const ListeningIndicator = styled.div`
  font-size: 13px;
  color: #CD0B16;
  font-weight: 500;
  text-align: center;
  margin-top: 4px;
  animation: pulse 1.5s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.6;
    }
  }
`;

export const SearchResults = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 2px;
  }
`;

export const ResultCard = styled.div`
  background-color: #FFFFFF;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-left: 3px solid ${props => {
    if (props.$urgency === 'critical') return '#CD0B16';
    if (props.$urgency === 'high') return '#FF9800';
    return '#9E9E9E';
  }};
  border-radius: 8px;
  padding: 16px;
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(0, 0, 0, 0.12);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }
`;

export const ResultHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  gap: 12px;
`;

export const ResultSymptom = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  margin: 0;
  flex: 1;
`;

export const UrgencyBadge = styled.span`
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
  background-color: ${props => {
    if (props.$urgency === 'critical') return '#FFEBEE';
    if (props.$urgency === 'high') return '#FFF3E0';
    return '#F5F5F5';
  }};
  color: ${props => {
    if (props.$urgency === 'critical') return '#CD0B16';
    if (props.$urgency === 'high') return '#FF9800';
    return '#666666';
  }};
`;

export const ProceduresList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ProcedureItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 6px 0;
`;

export const ProcedureNumber = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.06);
  color: #666666;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const ProcedureText = styled.div`
  font-size: 14px;
  color: #555555;
  line-height: 1.7;
  flex: 1;
`;

export const NoResults = styled.div`
  margin-top: 12px;
  padding: 20px;
  background-color: #FAFAFA;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
  color: #999999;
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

export const EmergencyRouteButton = styled.button`
  width: 100%;
  height: 64px;
  background: linear-gradient(135deg, #CD0B16 0%, #C30D16 50%, #B80F16 100%);
  color: #FFFFFF;
  border: none;
  border-radius: 10px;
  padding: 0 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(195, 13, 22, 0.2);
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 16px;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &:hover {
    background: linear-gradient(135deg, #B80F16 0%, #B00D14 50%, #A50F14 100%);
    box-shadow: 0 4px 12px rgba(195, 13, 22, 0.3);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const RouteIcon = styled.div`
  font-size: 28px;
  line-height: 1;
  flex-shrink: 0;
`;

export const RouteText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 3px;
  flex: 1;
`;

export const RouteTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  line-height: 1.2;
  text-align: left;
`;

export const RouteSubtitle = styled.div`
  font-size: 12px;
  font-weight: 400;
  opacity: 0.9;
  line-height: 1.2;
`;

