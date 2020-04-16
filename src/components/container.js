import styled from 'styled-components';
import {
  space, layout, position, color, typography,
} from 'styled-system';

export default styled.div`
  margin: 0 auto;
  max-width: ${({ theme }) => theme.containerSize};
  width: 100%;
  ${space}
  ${layout}
  ${position}
  ${color}
  ${typography}
`;
