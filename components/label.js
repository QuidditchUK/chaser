import styled from 'styled-components';
import { layout, space } from 'styled-system';

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.bodyCard};
  ${layout};
  ${space};

  a {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

export default Label;
