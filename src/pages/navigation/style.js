import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #FAFAFA;
  display: flex;
  flex-direction: column;
  padding-bottom: 120px;
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

export const DestinationCard = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #FFF5F5 0%, #FFE5E5 100%);
  border-radius: 12px;
  border: 2px solid rgba(0, 0, 0, 0.15);
  margin-bottom: 24px;
`;

export const DestinationIcon = styled.div`
  font-size: 48px;
`;

export const DestinationInfo = styled.div`
  flex: 1;
`;

export const DestinationName = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #CD0B16;
  margin-bottom: 8px;
`;

export const DestinationAddress = styled.div`
  font-size: 14px;
  color: #666666;
`;

export const RouteInfo = styled.div`
  margin-bottom: 24px;
  padding: 20px;
  background-color: #FFFFFF;
  border-radius: 12px;
  border: 2px solid rgba(0, 0, 0, 0.15);
`;

export const RouteToggle = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
`;

export const ToggleButton = styled.button`
  flex: 1;
  height: 44px;
  background-color: ${props => props.$active ? '#CD0B16' : '#FFFFFF'};
  color: ${props => props.$active ? '#FFFFFF' : '#CD0B16'};
  border: 2px solid rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.$active ? '#B80F16' : '#FFF5F5'};
  }
`;

export const RouteDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const RouteItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const RouteLabel = styled.div`
  font-size: 14px;
  color: #999999;
  font-weight: 500;
`;

export const RouteValue = styled.div`
  font-size: 16px;
  color: ${props => props.$highlight ? '#CD0B16' : '#333333'};
  font-weight: ${props => props.$highlight ? '700' : '500'};
  text-align: right;
`;

export const RouteArrow = styled.div`
  text-align: center;
  font-size: 24px;
  color: #CD0B16;
  margin: 8px 0;
`;

export const RouteDivider = styled.div`
  height: 1px;
  background-color: rgba(0, 0, 0, 0.1);
  margin: 12px 0;
`;

export const MapContainer = styled.div`
  width: 100%;
  height: 400px;
  border-radius: 12px;
  border: 2px solid rgba(0, 0, 0, 0.15);
  margin-bottom: 24px;
  overflow: hidden;
`;

export const DirectionsList = styled.div`
  padding: 20px;
  background-color: #FFFFFF;
  border-radius: 12px;
  border: 2px solid rgba(0, 0, 0, 0.15);
  margin-bottom: 24px;
`;

export const DirectionsTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #CD0B16;
  margin: 0 0 16px 0;
`;

export const DirectionItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

export const DirectionNumber = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #CD0B16;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
`;

export const DirectionText = styled.div`
  font-size: 15px;
  color: #333333;
  line-height: 1.5;
  flex: 1;
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

