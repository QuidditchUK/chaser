import styled from 'styled-components';

import {
  space,
  position,
  color,
  layout,
  grid,
  background,
  flexbox,
  border,
} from 'styled-system';

export const Box = styled.div`
  ${space}
  ${color}
  ${layout}
  ${background}
  ${flexbox}
  ${position}
  ${border}
  ${grid}
`;

export const Grid = styled.div`
  display: grid;
  ${space}
  ${grid}
  ${color}
  ${border}
`;

export const GridItem = styled.div`
  ${position}
  ${space}
  ${grid}
  ${color}
`;

export const Flex = styled.div`
  display: flex;
  ${position}
  ${space}
  ${flexbox}
  ${layout}
  ${color}
`;
