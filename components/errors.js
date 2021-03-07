import styled from '@emotion/styled';
import { layout, space } from 'styled-system';

const Error = styled.div`
  display: block;
  ${layout};
  ${space};

  color: ${({ theme }) => theme.colors.monarchRed};

  span {
    font-size: ${({ theme }) => theme.fontSizes.bodyCard};
  }
`;

export const InlineError = ({ children, ...errorProps }) => (
  <Error {...errorProps}>
    <span>{children}</span>
  </Error>
);
