import styled from 'styled-components';
import { space, color, typography } from 'styled-system';

export default styled('div')`
  ${space}
  ${color}
  ${typography}
  line-height: ${({ theme }) => theme.lineHeights.displayMobile};

  a {
    text-decoration: none;
    word-break: break-all;

    &:hover {
      text-decoration: underline;
    }
  }
`;
