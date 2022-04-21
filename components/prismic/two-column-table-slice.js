import { RichText } from 'prismic-reactjs';
import dynamic from 'next/dynamic';

import {
  Heading,
  Table,
  Td,
  Tr,
  Th as ChakraTh,
  Tbody,
  Thead,
} from '@chakra-ui/react';

const Slice = dynamic(() => import('components/shared/slice'));

const Th = (props) => (
  <ChakraTh
    textAlign="left"
    textTransform="normal"
    fontFamily="body"
    fontWeight="normal"
    fontSize="sm"
    {...props}
  />
);

const TwoColumnTable = ({ primary, items }) => {
  const { title, column_one_title, column_two_title, variant } = primary;

  return (
    <Slice variant={variant} size="sm">
      {RichText.asText(title) && (
        <Heading as="h2" fontSize="3xl" mt={2}>
          {RichText.asText(title)}
        </Heading>
      )}

      <Table colorScheme="white">
        <Thead>
          <Tr>
            <Th
              color={
                variant === 'light' || variant === 'white' ? 'inherit' : 'white'
              }
            >
              {RichText.asText(column_one_title)}
            </Th>
            <Th
              color={
                variant === 'light' || variant === 'white' ? 'inherit' : 'white'
              }
            >
              {RichText.asText(column_two_title)}
            </Th>
          </Tr>
        </Thead>

        <Tbody>
          {items.map((item, i) => (
            <Tr key={`${column_one_title}_${column_two_title}_${i}`}>
              <Td>{RichText.asText(item.column_one)}</Td>
              <Td>{RichText.asText(item.column_two)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Slice>
  );
};

export default TwoColumnTable;
