import styled from 'styled-components';
import { typography, color, space } from 'styled-system';

export const TYPES = {
  University: 'keeperGreen',
  Community: 'northernMagenta',
  Youth: 'southernBlue',
};

const Type = styled.span`
  ${typography};
  ${color};
  color: ${({ theme }) => theme.colors.white};
  text-transform: uppercase;
  border-radius: ${({ theme }) => theme.radii[1]};
  padding: ${({ theme }) => theme.space[1]} ${({ theme }) => theme.space[2]};
  ${space};
`;

export default Type;
