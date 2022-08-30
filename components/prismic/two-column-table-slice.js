import { RichText } from 'prismic-reactjs';
import dynamic from 'next/dynamic';
import { linkResolver } from 'modules/prismic';

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
          <RichText render={title} linkResolver={linkResolver} />
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
              <RichText render={column_one_title} linkResolver={linkResolver} />
            </Th>
            <Th
              color={
                variant === 'light' || variant === 'white' ? 'inherit' : 'white'
              }
            >
              <RichText render={column_two_title} linkResolver={linkResolver} />
            </Th>
          </Tr>
        </Thead>

        <Tbody>
          {items.map((item, i) => (
            <Tr key={`${column_one_title}_${column_two_title}_${i}`}>
              <Td>
                <RichText
                  render={item.column_one}
                  linkResolver={linkResolver}
                />
              </Td>
              <Td>
                <RichText
                  render={item.column_two}
                  linkResolver={linkResolver}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Slice>
  );
};

export default TwoColumnTable;
