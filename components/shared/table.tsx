import {
  Table as ChakraTable,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
  Skeleton,
  Td,
  ThemingProps,
  TableProps,
  BoxProps,
} from '@chakra-ui/react';
import { ReactNode } from 'react';

export default function Table({
  name = 'Table',
  columns,
  variant = 'striped',
  isLoading = false,
  skeletonRows = 5,
  tableProps,
  children,
}: {
  name?: string;
  variant?: 'striped' | 'simple' | 'unstyled';
  columns: string[] | (BoxProps & { label: string }[]);
  isLoading?: boolean;
  skeletonRows?: number;
  tableProps?: TableProps;
  children: ReactNode;
}) {
  return (
    <TableContainer>
      <ChakraTable variant={variant} {...tableProps}>
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
                    {columns?.map((column, index) => {
                      const isString = typeof column === 'string';
                      return (
                        <Td
                          key={`${name}-skeleton-${
                            isString ? column : column.label
                          }-${index}`}
                        >
                          <Skeleton height="20px" />
                        </Td>
                      );
                    })}
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
