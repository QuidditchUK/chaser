import styled from 'styled-components';
import { space, color, typography } from 'styled-system';

export default styled('h1')`
  font-family: ${({ theme }) => theme.fonts.heading};
  text-shadow: ${({ theme }) => theme.shadows.heading};
  ${space}
  ${color}
  ${typography}
`;
