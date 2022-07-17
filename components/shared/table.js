import {
  Table as ChakraTable,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
  Skeleton,
  Td,
} from '@chakra-ui/react';

export default function Table({
  name = 'Table',
  columns,
  variant = 'striped',
  isLoading = false,
  skeletonRows = 5,
  children,
}) {
  return (
    <TableContainer>
      <ChakraTable variant={variant}>
        <Thead>
          <Tr>
            {columns?.map((column, i) => {
              const isString = typeof column === 'string';

              const value = isString ? (
                <Th key={`${name}-column--${column}-${i}`}>{column}</Th>
              ) : (
                <Th key={`${name}-column--${column.label}-${i}`} {...column}>
                  {column.label}
                </Th>
              );

              return value;
            })}
          </Tr>
        </Thead>
        <Tbody>
          {isLoading ? (
            <>
              {Array(skeletonRows)
                .fill(0)
                .map((v, index) => (
                  <Tr key={`skeleton-loader-${name}-${index}`}>
                    {columns?.map((column, index) => (
                      <Td key={`${name}-skeleton-${column}-${index}`}>
                        <Skeleton height="20px" />
                      </Td>
                    ))}
                  </Tr>
                ))}
            </>
          ) : (
            <>{children}</>
          )}
        </Tbody>
      </ChakraTable>
    </TableContainer>
  );
}
