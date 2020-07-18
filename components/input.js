import styled from 'styled-components';
import { layout, space, border } from 'styled-system';

const Input = styled.input`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme, error }) => (error ? theme.colors.secondary : theme.colors.white)};
  border-radius: ${({ theme }) => theme.radii[0]};
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.body};
  padding: ${({ theme }) => theme.space[2]};
  ${layout};
  ${space};
  ${border}
`;

export default Input;
