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
  padding: 32px 40px;
  background-color: #FAFAFA;
  border-bottom: 2px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
`;

export const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #CD0B16;
  margin: 0 0 12px 0;
`;

export const Description = styled.p`
  font-size: 16px;
  color: #666666;
  margin: 0 0 20px 0;
  line-height: 1.6;
`;

export const LocationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #333333;
`;

export const LocationDot = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #2196F3;
  box-shadow: 0 0 0 4px rgba(33, 150, 243, 0.3);
  border: 2px solid #FFFFFF;
`;

export const HeaderControls = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  align-items: center;
`;

export const SearchInput = styled.input`
  flex: 1;
  height: 48px;
  padding: 0 20px;
  border: 2px solid rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  font-size: 16px;
  background-color: #FFFFFF;
  color: #333333;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &::placeholder {
    color: #999999;
  }

  &:focus {
    outline: none;
    border-color: rgba(0, 0, 0, 0.3);
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
  }
`;

export const RelocateButton = styled.button`
  height: 48px;
  padding: 0 24px;
  background-color: #CD0B16;
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    background-color: #B80F16;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(205, 11, 22, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const NearestRouteButton = styled.button`
  height: 48px;
  padding: 0 24px;
  background-color: #FFFFFF;
  color: #CD0B16;
  border: 2px solid rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    background-color: #FFF5F5;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(205, 11, 22, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const Legend = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666666;
`;

export const LegendDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.$color || '#9E9E9E'};
`;

export const MainContent = styled.div`
  display: flex;
  flex: 1;
  height: calc(100vh - 280px);
  min-height: 600px;
`;

export const MapArea = styled.div`
  flex: 2;
  background-color: #F5F5F5;
  position: relative;
  border-right: 2px solid rgba(0, 0, 0, 0.15);
`;

export const MapPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #E0E0E0;
`;

export const MapInstruction = styled.p`
  color: #666666;
  font-size: 16px;
  text-align: center;
  padding: 20px;
  background-color: #F5F5F5;
  border-radius: 8px;
  border: 2px dashed #CCCCCC;
`;

export const InfoPanel = styled.div`
  flex: 1;
  background-color: #FFFFFF;
  padding: 24px;
  overflow-y: auto;
  min-width: 400px;
`;

export const PanelHeader = styled.div`
  margin-bottom: 24px;
`;

export const PanelTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #CD0B16;
  margin: 0 0 12px 0;
`;

export const FilterInfo = styled.p`
  font-size: 14px;
  color: #666666;
  margin: 0 0 12px 0;
`;

export const SortSelect = styled.select`
  width: 100%;
  height: 40px;
  padding: 0 16px;
  border: 2px solid rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  font-size: 14px;
  background-color: #FFFFFF;
  color: #333333;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: rgba(0, 0, 0, 0.3);
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
  }
`;

export const StatusLegend = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px;
  background-color: #FFF9F9;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  flex-wrap: wrap;
`;

export const EmergencyRoomList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`;

export const EmergencyRoomCard = styled.div`
  padding: 20px;
  background-color: #FFFFFF;
  border: 2px solid rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(0, 0, 0, 0.3);
    box-shadow: 0 4px 12px rgba(205, 11, 22, 0.15);
    transform: translateY(-2px);
  }
`;

export const RoomHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 12px;
`;

export const RoomName = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #333333;
  margin: 0;
  flex: 1;
`;

export const StatusBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background-color: ${props => props.$color ? `${props.$color}15` : '#F5F5F5'};
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.$color || '#666666'};
  white-space: nowrap;
`;

export const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.$color || '#9E9E9E'};
`;

export const RoomAddress = styled.p`
  font-size: 14px;
  color: #666666;
  margin: 0 0 8px 0;
  line-height: 1.5;
`;

export const RoomHours = styled.p`
  font-size: 13px;
  color: #999999;
  margin: 0 0 8px 0;
`;

export const RoomDistance = styled.p`
  font-size: 14px;
  color: #CD0B16;
  font-weight: 600;
  margin: 0 0 12px 0;
`;

export const RoomSpecialties = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const SpecialtyTag = styled.span`
  padding: 4px 12px;
  background-color: #FFF5F5;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 16px;
  font-size: 12px;
  color: #CD0B16;
  font-weight: 500;
`;

export const Disclaimer = styled.p`
  font-size: 12px;
  color: #999999;
  margin: 0 0 12px 0;
  line-height: 1.5;
`;

export const UpdateLink = styled.a`
  font-size: 13px;
  color: #CD0B16;
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.3s ease;
  display: block;
  margin-bottom: 12px;

  &:hover {
    color: #B80F16;
    text-decoration: underline;
  }
`;

export const HelpButton = styled.button`
  width: 100%;
  height: 48px;
  background-color: #FFFFFF;
  color: #CD0B16;
  border: 2px solid rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #FFF5F5;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(205, 11, 22, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

