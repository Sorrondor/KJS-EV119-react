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
  margin: 0;
`;

export const Content = styled.div`
  flex: 1;
  padding: 24px 20px;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
`;

export const StatusSection = styled.div`
  margin-bottom: 32px;
  padding: 20px;
  background-color: #FFF9F9;
  border-radius: 12px;
  border: 2px solid rgba(0, 0, 0, 0.15);
`;

export const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: ${props => props.$color ? `${props.$color}15` : '#F5F5F5'};
  border-radius: 24px;
  font-size: 16px;
  font-weight: 700;
  color: ${props => props.$color || '#666666'};
  margin-bottom: 16px;
`;

export const StatusDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.$color || '#9E9E9E'};
`;

export const MessageBox = styled.div`
  padding: 16px;
  background-color: ${props => {
    switch (props.$status) {
      case 'available':
        return '#E8F5E9';
      case 'crowded':
        return '#FFF3E0';
      case 'full':
        return '#FFEBEE';
      default:
        return '#F5F5F5';
    }
  }};
  border-left: 4px solid ${props => {
    switch (props.$status) {
      case 'available':
        return '#00C853';
      case 'crowded':
        return '#FF9800';
      case 'full':
        return '#CD0B16';
      default:
        return '#9E9E9E';
    }
  }};
  border-radius: 8px;
  font-size: 15px;
  color: #333333;
  line-height: 1.6;
`;

export const InfoSection = styled.div`
  margin-bottom: 32px;
`;

export const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #CD0B16;
  margin: 0 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid rgba(0, 0, 0, 0.15);
`;

export const InfoItem = styled.div`
  margin-bottom: 20px;
`;

export const InfoLabel = styled.div`
  font-size: 14px;
  color: #999999;
  margin-bottom: 8px;
  font-weight: 500;
`;

export const InfoValue = styled.div`
  font-size: 16px;
  color: #333333;
  line-height: 1.6;
`;

export const PhoneLink = styled.a`
  color: #CD0B16;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;

  &:hover {
    color: #B80F16;
    text-decoration: underline;
  }
`;

export const SpecialtyList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export const SpecialtyTag = styled.span`
  padding: 8px 16px;
  background-color: #FFF5F5;
  border: 2px solid rgba(0, 0, 0, 0.15);
  border-radius: 20px;
  font-size: 14px;
  color: #CD0B16;
  font-weight: 600;
`;

export const DepartmentList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export const DepartmentTag = styled.span`
  padding: 8px 16px;
  background-color: #F5F5F5;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 20px;
  font-size: 14px;
  color: #666666;
  font-weight: 500;
`;

export const FacilityList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export const FacilityTag = styled.span`
  padding: 8px 16px;
  background-color: #E3F2FD;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 20px;
  font-size: 14px;
  color: #1976D2;
  font-weight: 500;
`;

export const ActionButtons = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background-color: #FAFAFA;
  border-top: 2px solid rgba(0, 0, 0, 0.05);
  display: flex;
  gap: 12px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.03);
  z-index: 100;
`;

export const PrimaryButton = styled.button`
  flex: 1;
  height: 56px;
  background-color: #CD0B16;
  color: #FFFFFF;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #B80F16;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(205, 11, 22, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const SecondaryButton = styled.button`
  flex: 1;
  height: 56px;
  background-color: #FFFFFF;
  color: #CD0B16;
  border: 2px solid rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #FFF5F5;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(205, 11, 22, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 18px;
  color: #666666;
`;

