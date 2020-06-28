import styled from 'styled-components';
import { typography, border } from 'styled-system';

export const Table = styled.table`
  ${typography};
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
`;

export const TableData = styled.td`
  padding: ${({ theme }) => theme.space[1]};
`;

export const TableDataBorder = styled(TableData)`
  border-bottom-width: 1px;
  border-bottom-style: solid;
  ${border};
`;

export const TableRow = styled.tr`
  border-collapse: separate;
  border-spacing: 0;
  vertical-align: top;
`;

export const TableHead = styled.th`
  text-align: left;
  padding: ${({ theme }) => theme.space[1]};
  border-bottom-style: solid;
  border-bottom-width: 3px;
`;
