import React from 'react';
import get from 'just-safe-get';
import { Formik, Form, Field } from 'formik';
import { useRouter } from 'next/router';

import { Box, Flex } from 'components/layout';
import Heading from 'components/heading';
import Button from 'components/button';
import Input from 'components/input';
import { HERO_MIN_HEIGHTS } from 'styles/hero-heights';

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
      minHeight={HERO_MIN_HEIGHTS}
      px={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}
    >
      <Flex
        position="relative"
        minHeight={HERO_MIN_HEIGHTS}
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Heading as="label" htmlFor="prismic_postcode" fontSize={4} color="white" textAlign="center" mt={0} textShadow="body" pb="7">{data.title}</Heading>
        <Formik
          initialValues={{ postcode: '' }}
          onSubmit={({ postcode }) => router.push(`/find-quidditch${postcode ? `?postcode=${postcode}` : ''}`).then(() => window.scrollTo(0, 0))}
        >
          <Form>
            <Flex flexDirection="row">
              <Field as={Input} id="prismic_postcode" placeholder="Enter your postcode" name="postcode" /><Button type="submit" variant={data.variant} ml={2}>Find Quidditch</Button>
            </Flex>
          </Form>
        </Formik>

      </Flex>
    </Box>
  );
};

export default FindQuidditch;
