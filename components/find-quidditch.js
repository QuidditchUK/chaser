import React from 'react';
import get from 'just-safe-get';

import { Box, Flex } from './layout';
import Heading from './heading';
import Button from './button';
import Input from './input';

const minHeight = { _: '300px', m: '400px' };

const FindQuidditch = (rawData) => {
  const data = {
    title: get(rawData, 'primary.title'),
    image: get(rawData, 'primary.image.url'),
    variant: get(rawData, 'primary.variant'),
  };

  return (
    <Box
      as="section"
      position="relative"
      backgroundImage={'url(\'https://images.prismic.io/chaser/3380a000-d9a3-428f-bf3d-756c2c391175_78248510_3677594125614820_5391209165173555200_o.jpg?auto=compress,format\')'}
      backgroundColor="primary"
      backgroundSize="cover"
      backgroundPosition="center"
      minHeight={minHeight}
      px={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}
    >
      <Flex
        position="relative"
        minHeight={minHeight}
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Heading as="h2" fontSize={[3, 3, 4]} color="white" textAlign="center" mt={0}>{data.title}</Heading>
        <Flex flexDirection="row">
          <Input type="text" placeholder="Enter your postcode" /><Button type="button" variant="secondary" ml={2}>Find Quidditch</Button>
        </Flex>

      </Flex>
    </Box>
  );
};

export default FindQuidditch;
