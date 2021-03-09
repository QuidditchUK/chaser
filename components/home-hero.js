import { useRouter } from 'next/router';
import get from 'just-safe-get';
import { Formik, Form, Field } from 'formik';

import Input from 'components/input';
import Button from 'components/button';
import { Flex, Box, Heading } from '@chakra-ui/react';
import { HERO_MIN_HEIGHTS } from 'styles/hero-heights';

const Video = (props) => (
  <Box as="video" w="121%" minH="100%" objectFit="cover" {...props} />
);

const HomeHero = (rawData) => {
  const router = useRouter();

  const title = get(rawData, 'primary.slug');
  const cta_text = get(rawData, 'primary.cta_text');
  const video = get(rawData, 'primary.video_url.url');
  const poster = get(rawData, 'primary.poster.url');

  return (
    <Box
      as="section"
      backgroundColor="qukBlue"
      minHeight={HERO_MIN_HEIGHTS}
      overflow="hidden"
      position="relative"
    >
      <Box minHeight={HERO_MIN_HEIGHTS} position="absolute">
        <Video
          src={video}
          poster={poster}
          preload="metadata"
          autoPlay
          loop
          muted
        />
      </Box>

      <Flex
        position="relative"
        minHeight={HERO_MIN_HEIGHTS}
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Heading
          as="label"
          htmlFor="hero_postcode"
          fontSize={{ base: '4xl', md: '7xl' }}
          mt={0}
          mb={8}
          color="white"
          textShadow="lg"
        >
          {title}
        </Heading>

        <Formik
          initialValues={{ postcode: '' }}
          onSubmit={({ postcode }) =>
            router
              .push(`/find-quidditch${postcode ? `?postcode=${postcode}` : ''}`)
              .then(() => window.scrollTo(0, 0))
          }
        >
          <Form>
            <Flex flexDirection="row">
              <Field
                id="hero_postcode"
                name="postcode"
                placeholder="Postcode"
                as={Input}
              />
              <Button type="submit" variant="primary" ml={2}>
                {cta_text}
              </Button>
            </Flex>
          </Form>
        </Formik>
      </Flex>
    </Box>
  );
};

export default HomeHero;
