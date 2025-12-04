import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #FAFAFA;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.div`
  width: 100%;
  padding: 24px 20px;
  background-color: #FAFAFA;
  border-bottom: 2px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  color: #CD0B16;
  cursor: pointer;
  padding: 8px 0;
  margin-bottom: 12px;
  font-weight: 600;
  transition: color 0.3s ease;

  &:hover {
    color: #B80F16;
  }
`;

export const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #CD0B16;
  margin: 0 0 8px 0;
`;

export const Description = styled.p`
  font-size: 14px;
  color: #666666;
  margin: 0;
  line-height: 1.5;
`;

export const Content = styled.div`
  flex: 1;
  padding: 24px 20px;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
`;

export const HelpSection = styled.div`
  margin-bottom: 16px;
  background-color: #FFFFFF;
  border: 2px solid rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(0, 0, 0, 0.3);
    box-shadow: 0 2px 8px rgba(205, 11, 22, 0.1);
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  cursor: pointer;
  background-color: #FFF9F9;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #FFF5F5;
  }
`;

export const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #CD0B16;
  margin: 0;
  flex: 1;
`;

export const ToggleIcon = styled.div`
  font-size: 14px;
  color: #CD0B16;
  transition: transform 0.3s ease;
  transform: ${props => props.$active ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

export const SectionContent = styled.div`
  padding: 20px;
  background-color: #FFFFFF;
  border-top: 1px solid rgba(0, 0, 0, 0.15);
  line-height: 1.8;
`;

export const ContentLine = styled.div`
  font-size: 15px;
  color: #333333;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
  }

  &:first-child {
    font-weight: 600;
    color: #CD0B16;
    margin-bottom: 16px;
  }
`;

export const EmergencyButton = styled.button`
  width: 100%;
  height: 64px;
  background-color: #CD0B16;
  color: #FFFFFF;
  border: none;
  border-radius: 12px;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 32px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(205, 11, 22, 0.3);

  &:hover {
    background-color: #B80F16;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(205, 11, 22, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

