import styled from 'styled-components';
import { Link } from 'react-router-dom';

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
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
`;

export const ProfileSection = styled.div`
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 32px 24px;
  text-align: center;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: relative;
`;

export const ProfileImage = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #F5F5F5;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
`;

export const ProfileIcon = styled.div`
  font-size: 40px;
`;

export const ProfileName = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #333333;
  margin: 0 0 8px 0;
`;

export const ProfileEmail = styled.p`
  font-size: 14px;
  color: #666666;
  margin: 0;
`;

export const EditButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  padding: 8px 16px;
  background-color: #FFFFFF;
  color: #CD0B16;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #FFF5F5;
    border-color: #CD0B16;
  }
`;

export const MenuSection = styled.div`
  margin-bottom: 24px;
`;

export const MenuTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #999999;
  margin: 0 0 12px 0;
  padding: 0 4px;
`;

export const MenuList = styled.div`
  background-color: #FFFFFF;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

export const MenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 20px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #FAFAFA;
  }

  &:active {
    background-color: #F5F5F5;
  }
`;

export const MenuIcon = styled.div`
  font-size: 20px;
  margin-right: 12px;
  width: 24px;
  text-align: center;
`;

export const MenuText = styled.div`
  flex: 1;
  font-size: 15px;
  color: #333333;
  font-weight: 500;
`;

export const MenuArrow = styled.div`
  font-size: 20px;
  color: #999999;
`;

export const LogoutButton = styled.button`
  width: 100%;
  height: 52px;
  background-color: #FFFFFF;
  color: #CD0B16;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 24px;

  &:hover {
    background-color: #FFF5F5;
    border-color: #CD0B16;
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const FormSection = styled.div`
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #333333;
`;

export const Input = styled.input`
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  font-size: 15px;
  color: #333333;
  background-color: #FFFFFF;
  box-sizing: border-box;
  transition: all 0.2s ease;

  &::placeholder {
    color: #999999;
  }

  &:focus {
    outline: none;
    border-color: #CD0B16;
    background-color: #FAFAFA;
  }
`;

export const InfoValue = styled.div`
  font-size: 15px;
  color: #333333;
  padding: 12px 0;
`;

export const FieldError = styled.div`
  font-size: 12px;
  color: #CD0B16;
  margin-top: -4px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

export const CancelButton = styled.button`
  flex: 1;
  height: 48px;
  background-color: #FFFFFF;
  color: #666666;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #FAFAFA;
    border-color: rgba(0, 0, 0, 0.2);
  }
`;

export const SaveButton = styled.button`
  flex: 1;
  height: 48px;
  background: linear-gradient(135deg, #CD0B16 0%, #C30D16 50%, #B80F16 100%);
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: linear-gradient(135deg, #B80F16 0%, #B00D14 50%, #A50F14 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(195, 13, 22, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  overflow-x: auto;
  padding-bottom: 4px;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 2px;
  }
`;

export const Tab = styled.button`
  flex: 1;
  min-width: 80px;
  padding: 12px 8px;
  background-color: ${props => props.$active ? '#FFFFFF' : '#F5F5F5'};
  border: 1px solid ${props => props.$active ? '#CD0B16' : 'rgba(0, 0, 0, 0.08)'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  &:hover {
    background-color: ${props => props.$active ? '#FFFFFF' : '#FAFAFA'};
    border-color: ${props => props.$active ? '#CD0B16' : 'rgba(0, 0, 0, 0.15)'};
  }
`;

export const TabIcon = styled.div`
  font-size: 20px;
`;

export const TabLabel = styled.span`
  font-size: 12px;
  font-weight: ${props => props.$active ? '600' : '500'};
  color: ${props => props.$active ? '#CD0B16' : '#666666'};
`;

export const HealthSection = styled.div`
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: relative;
`;

export const BasicInfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const Select = styled.select`
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  font-size: 15px;
  color: #333333;
  background-color: #FFFFFF;
  box-sizing: border-box;
  transition: all 0.2s ease;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #CD0B16;
    background-color: #FAFAFA;
  }
`;

export const TagInput = styled.input`
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  font-size: 15px;
  color: #333333;
  background-color: #FFFFFF;
  box-sizing: border-box;
  transition: all 0.2s ease;
  margin-bottom: 8px;

  &::placeholder {
    color: #999999;
  }

  &:focus {
    outline: none;
    border-color: #CD0B16;
    background-color: #FAFAFA;
  }
`;

export const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background-color: #FFF5F5;
  border: 1px solid #FFE5E5;
  border-radius: 16px;
  font-size: 13px;
  color: #CD0B16;
  font-weight: 500;
`;

export const TagRemove = styled.button`
  background: none;
  border: none;
  color: #CD0B16;
  font-size: 16px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #B80F16;
  }
`;

export const MedicationSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const MedicationCard = styled.div`
  padding: 16px;
  background-color: #FAFAFA;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 8px;
`;

export const MedicationName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 8px;
`;

export const MedicationInfo = styled.div`
  font-size: 14px;
  color: #666666;
`;

export const AllergySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const AllergyCard = styled.div`
  padding: 16px;
  background-color: #FAFAFA;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-left: 3px solid #FF9800;
  border-radius: 8px;
`;

export const AllergyType = styled.div`
  font-size: 12px;
  color: #999999;
  margin-bottom: 4px;
`;

export const AllergyName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333333;
`;

export const EmergencySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const EmergencyCard = styled.div`
  padding: 16px;
  background-color: #FAFAFA;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-left: 3px solid #CD0B16;
  border-radius: 8px;
`;

export const EmergencyName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 4px;
`;

export const EmergencyRelation = styled.div`
  font-size: 13px;
  color: #666666;
  margin-bottom: 8px;
`;

export const EmergencyPhone = styled.a`
  font-size: 15px;
  color: #CD0B16;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

export const AddButton = styled.button`
  width: 100%;
  height: 48px;
  background-color: #FFFFFF;
  color: #CD0B16;
  border: 2px dashed rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 8px;

  &:hover {
    border-color: #CD0B16;
    background-color: #FFF5F5;
  }
`;

export const RemoveButton = styled.button`
  width: 100%;
  height: 40px;
  background-color: #FFFFFF;
  color: #CD0B16;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 12px;

  &:hover {
    background-color: #FFEBEE;
    border-color: #CD0B16;
  }
`;

export const FilterContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

export const FilterButton = styled.button`
  padding: 8px 16px;
  background-color: ${props => props.$active ? '#CD0B16' : '#FFFFFF'};
  color: ${props => props.$active ? '#FFFFFF' : '#666666'};
  border: 1px solid ${props => props.$active ? '#CD0B16' : 'rgba(0, 0, 0, 0.12)'};
  border-radius: 8px;
  font-size: 14px;
  font-weight: ${props => props.$active ? '600' : '500'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.$active ? '#B80F16' : '#FAFAFA'};
    border-color: ${props => props.$active ? '#B80F16' : 'rgba(0, 0, 0, 0.2)'};
  }
`;

export const AddFormCard = styled.div`
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 24px;
`;

export const FormTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #333333;
  margin: 0 0 20px 0;
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 12px 16px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  font-size: 15px;
  color: #333333;
  background-color: #FFFFFF;
  box-sizing: border-box;
  transition: all 0.2s ease;
  font-family: inherit;
  resize: vertical;

  &::placeholder {
    color: #999999;
  }

  &:focus {
    outline: none;
    border-color: #CD0B16;
    background-color: #FAFAFA;
  }
`;

export const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const HistoryCard = styled.div`
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border-left: 4px solid #CD0B16;
`;

export const HistoryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
`;

export const HistoryDate = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #333333;
  flex: 1;
`;

export const TypeBadge = styled.span`
  padding: 4px 12px;
  background-color: ${props => props.$color ? `${props.$color}15` : '#F5F5F5'};
  color: ${props => props.$color || '#666666'};
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
`;

export const DeleteButton = styled.button`
  padding: 4px 12px;
  background-color: #FFFFFF;
  color: #CD0B16;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #FFEBEE;
    border-color: #CD0B16;
  }
`;

export const HospitalName = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #333333;
  margin: 0 0 4px 0;
`;

export const Department = styled.div`
  font-size: 14px;
  color: #666666;
  margin-bottom: 12px;
`;

export const DoctorInfo = styled.div`
  font-size: 13px;
  color: #999999;
  margin-bottom: 12px;
`;

export const InfoRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  align-items: flex-start;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const InfoLabel = styled.span`
  font-size: 13px;
  color: #999999;
  font-weight: 500;
  min-width: 80px;
`;

export const EmptyMessage = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #999999;
  font-size: 15px;
`;

