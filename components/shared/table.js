import {
  Table as ChakraTable,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
} from '@chakra-ui/react';

export default function Table({
  name = 'Table',
  columns,
  variant = 'striped',
  children,
}) {
  return (
    <TableContainer>
      <ChakraTable variant={variant}>
        <Thead>
          <Tr>
            {columns?.map((column, i) => (
              <Th key={`${name}-column--${column}-${i}`}>{column}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>{children}</Tbody>
      </ChakraTable>
    </TableContainer>
  );
}
