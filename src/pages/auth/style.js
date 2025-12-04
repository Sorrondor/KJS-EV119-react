import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #FAFAFA;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.header`
  padding: 40px 24px 30px;
  text-align: center;
  background-color: #FAFAFA;
`;

export const Logo = styled(Link)`
  font-size: 48px;
  font-weight: 800;
  color: #CD0B16;
  margin: 0 0 8px 0;
  letter-spacing: -2px;
  text-decoration: none;
  display: inline-block;
`;

export const Subtitle = styled.p`
  font-size: 14px;
  color: #666666;
  margin: 0;
  font-weight: 500;
`;

export const MainContent = styled.main`
  flex: 1;
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  padding: 20px 24px 40px;
  box-sizing: border-box;
`;

export const FormCard = styled.div`
  background-color: #FFFFFF;
  border-radius: 12px;
  padding: 32px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

export const FormTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #333333;
  margin: 0 0 8px 0;
  text-align: center;
`;

export const FormSubtitle = styled.p`
  font-size: 14px;
  color: #666666;
  margin: 0 0 32px 0;
  text-align: center;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
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

export const FieldError = styled.div`
  font-size: 12px;
  color: #CD0B16;
  margin-top: -4px;
`;

export const ErrorMessage = styled.div`
  padding: 12px;
  background-color: #FFEBEE;
  border: 1px solid #FFCDD2;
  border-radius: 8px;
  font-size: 14px;
  color: #CD0B16;
  text-align: center;
`;

export const SubmitButton = styled.button`
  width: 100%;
  height: 52px;
  background: linear-gradient(135deg, #CD0B16 0%, #C30D16 50%, #B80F16 100%);
  color: #FFFFFF;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 8px;

  &:hover {
    background: linear-gradient(135deg, #B80F16 0%, #B00D14 50%, #A50F14 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(195, 13, 22, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 8px 0;
`;

export const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.1);
`;

export const DividerText = styled.span`
  font-size: 13px;
  color: #999999;
`;

export const SocialButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const SocialButton = styled.button`
  width: 100%;
  height: 48px;
  background-color: ${props => {
    if (props.$variant === 'kakao') return '#FEE500';
    if (props.$variant === 'naver') return '#03C75A';
    return '#FFFFFF';
  }};
  color: ${props => {
    if (props.$variant === 'kakao') return '#000000';
    if (props.$variant === 'naver') return '#FFFFFF';
    return '#333333';
  }};
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const SocialIcon = styled.span`
  font-size: 18px;
`;

export const LinkContainer = styled.div`
  text-align: center;
  margin-top: 8px;
`;

export const LinkText = styled.p`
  font-size: 14px;
  color: #666666;
  margin: 0;
`;

export const StyledLink = styled(Link)`
  color: #CD0B16;
  text-decoration: none;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;

