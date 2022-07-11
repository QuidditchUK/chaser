import {
  Table as ChakraTable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react';

export default function Table({
  name = 'Table',
  columns,
  variant = 'striped',
  rows,
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
        <Tbody>
          {rows?.map((row) => (
            <Tr key={row?.key}>
              {row?.data?.map(({ key, ...data }) => (
                <Td key={`${name}-row--${row?.key}-${key}`} {...data} />
              ))}
            </Tr>
          ))}
        </Tbody>
      </ChakraTable>
    </TableContainer>
  );
}
