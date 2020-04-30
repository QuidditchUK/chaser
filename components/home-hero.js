import React from 'react';
import { useRouter } from 'next/router';
import get from 'just-safe-get';
import { Formik, Form, Field } from 'formik';
import styled from 'styled-components';
import Input from './input';
import Button from './button';
import { HeadingHero } from './hero';
import { Flex, Box } from './layout';

const heightBreakpoints = { _: '250px', m: '540px' };

const Video = styled.video`
  width: 121%;
  min-height: 100%;
`;

const HomeHero = (rawData) => {
  const router = useRouter();

  const data = {
    title: get(rawData, 'primary.slug'),
    cta_text: get(rawData, 'primary.cta_text'),
    cta_url: get(rawData, 'primary.cta_url'),
    video: get(rawData, 'primary.video_url.url'),
    poster: get(rawData, 'primary.poster.url'),
  };

  return (
    <Box
      as="section"
      backgroundColor="primary"
      minHeight={heightBreakpoints}
      overflow="hidden"
      position="relative"
    >
      <Box
        minHeight={heightBreakpoints}
        position="absolute"
        zIndex={1}
      >
        <Video src={data.video} poster={data.poster} preload="metadata" autoPlay loop muted />
      </Box>

      <Flex
        position="relative"
        minHeight={heightBreakpoints}
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        zIndex={2}
      >
        <HeadingHero fontSize={[4, 4, 7]} mt={0} mb={8} color="white">{data.title}</HeadingHero>

        <Formik
          initialValues={{ postcode: '' }}
          onSubmit={({ postcode }) => router.push(`/find-quidditch${postcode ? `?postcode=${postcode}` : ''}`)}
        >
          <Form>
            <Flex flexDirection="row">
              <Field name="postcode" placeholder="Postcode" as={Input} />
              <Button type="submit" variant="primary" ml={2}>{data.cta_text}</Button>
            </Flex>
          </Form>
        </Formik>
      </Flex>
    </Box>
  );
};

export default HomeHero;
