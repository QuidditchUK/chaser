import styled from '@emotion/styled';
import { layout, space } from 'styled-system';

const Textarea = styled.textarea`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid
    ${({ theme, error }) =>
      error ? theme.colors.monarchRed : theme.colors.white};
  border-radius: ${({ theme }) => theme.radii[0]};
  color: ${({ theme }) => theme.colors.qukBlue};
  font-size: ${({ theme }) => theme.fontSizes.body};
  padding: ${({ theme }) => theme.space[2]};
  ${layout};
  ${space};
`;

export default Textarea;
