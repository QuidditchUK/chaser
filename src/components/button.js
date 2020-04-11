import styled from 'styled-components';
import { hoverStates } from '../styles/styles';

export default styled.button`
  background: ${({ theme, color }) => theme.colors[color] || theme.colors.primary};
  border: ${({ theme }) => theme.radius[0]} solid ${({ theme, color }) => theme.colors[color] || theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius[0]};
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  display: inline-block;
  font-size: ${({ theme }) => theme.fontSizes.body};
  padding: ${({ theme }) => theme.spaces[1]} ${({ theme }) => theme.spaces[3]};

  &:hover {
    ${({ theme, color }) => hoverStates(theme.colors[color] || theme.colors.primary).buttons};
  }
`;
