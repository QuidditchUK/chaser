import styled from 'styled-components';
import { space, color, typography } from 'styled-system';

export default styled('div')`
  ${space}
  ${color}
  ${typography}
  line-height: ${({ theme }) => theme.lineHeights.displayMobile};

  a {
    color: ${({ theme }) => theme.colors.secondary};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;
