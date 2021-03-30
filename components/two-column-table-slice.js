import { RichText } from 'prismic-reactjs';
import get from 'just-safe-get';
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

const PrismicWrapper = dynamic(() => import('components/prismic-wrapper'));

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

const TwoColumnTable = (rawData) => {
  const title = get(rawData, 'primary.title');
  const columnOneTitle = get(rawData, 'primary.column_one_title');
  const columnTwoTitle = get(rawData, 'primary.column_two_title');
  const variant = get(rawData, 'primary.variant');
  const items = get(rawData, 'items');

  return (
    <PrismicWrapper variant={variant} small>
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
              {RichText.asText(columnOneTitle)}
            </Th>
            <Th
              color={
                variant === 'light' || variant === 'white' ? 'inherit' : 'white'
              }
            >
              {RichText.asText(columnTwoTitle)}
            </Th>
          </Tr>
        </Thead>

        <Tbody>
          {items.map((item, i) => (
            <Tr key={`${columnOneTitle}_${columnTwoTitle}_${i}`}>
              <Td>{RichText.asText(item.column_one)}</Td>
              <Td>{RichText.asText(item.column_two)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </PrismicWrapper>
  );
};

export default TwoColumnTable;
