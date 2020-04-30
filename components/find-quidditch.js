import React from 'react';
import get from 'just-safe-get';
import { Formik, Form, Field } from 'formik';
import { useRouter } from 'next/router';

import { Box, Flex } from './layout';
import Heading from './heading';
import Button from './button';
import Input from './input';

const minHeight = { _: '300px', m: '400px' };

const FindQuidditch = (rawData) => {
  const router = useRouter();
  const data = {
    title: get(rawData, 'primary.title'),
    image: get(rawData, 'primary.image.url'),
    variant: get(rawData, 'primary.variant'),
  };

  return (
    <Box
      as="section"
      position="relative"
      backgroundImage={`url(${data.image})`}
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
        <Formik
          initialValues={{ postcode: '' }}
          onSubmit={({ postcode }) => router.push(`/find-quidditch${postcode ? `?postcode=${postcode}` : ''}`)}
        >
          <Form>
            <Flex flexDirection="row">
              <Field as={Input} placeholder="Enter your postcode" name="postcode" /><Button type="submit" variant={data.variant} ml={2}>Find Quidditch</Button>
            </Flex>
          </Form>
        </Formik>

      </Flex>
    </Box>
  );
};

export default FindQuidditch;
