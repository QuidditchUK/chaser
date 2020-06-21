import styled from 'styled-components';
import { space, color, typography, shadow } from 'styled-system';

export default styled('h1')`
  font-family: ${({ theme, isBody }) => (isBody ? theme.fonts.body : theme.fonts.heading)};
  ${space};
  ${color};
  ${typography};
  ${shadow};
`;
