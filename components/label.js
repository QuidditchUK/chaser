import styled from '@emotion/styled';
import { layout, space } from 'styled-system';

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.bodyCard};
  ${layout};
  ${space};

  a {
    color: ${({ theme }) => theme.colors.monarchRed};
  }
`;

export default Label;
