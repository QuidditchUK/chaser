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
            {columns?.map((column, i) => (
              <Th key={`${name}-column--${column}-${i}`}>{column}</Th>
            ))}
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
                        <Skeleton />
                      </Td>
                    ))}
                    <Td>
                      <Skeleton />
                    </Td>
                    <Td>
                      <Skeleton />
                    </Td>
                    <Td>
                      <Skeleton />
                    </Td>
                    <Td>
                      <Skeleton />
                    </Td>
                    <Td>
                      <Skeleton />
                    </Td>
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
