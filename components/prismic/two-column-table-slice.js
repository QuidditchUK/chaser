import { PrismicRichText } from '@prismicio/react';
import * as prismicH from '@prismicio/helpers';

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

const TwoColumnTable = ({ slice }) => {
  const { primary, items } = slice;
  const { title, column_one_title, column_two_title, variant } = primary;

  return (
    <Slice variant={variant} size="sm">
      {prismicH.asText(title) && (
        <Heading as="h2" fontSize="3xl" mt={2}>
          <PrismicRichText field={title} />
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
              <PrismicRichText field={column_one_title} />
            </Th>
            <Th
              color={
                variant === 'light' || variant === 'white' ? 'inherit' : 'white'
              }
            >
              <PrismicRichText field={column_two_title} />
            </Th>
          </Tr>
        </Thead>

        <Tbody>
          {items.map((item, i) => (
            <Tr key={`${column_one_title}_${column_two_title}_${i}`}>
              <Td>
                <PrismicRichText field={item.column_one} />
              </Td>
              <Td>
                <PrismicRichText field={item.column_two} />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Slice>
  );
};

export default TwoColumnTable;
