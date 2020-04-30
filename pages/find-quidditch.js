import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Layout from '~/containers/layout';
import { Box, Flex } from '~/components/layout';
import { HeadingHero } from '~/components/hero';
import Container from '~/components/container';
import Heading from '~/components/heading';
// import { formatMetadata } from '../modules/prismic';
// import Meta from '../components/meta';

const minHeight = { _: '250px', m: '400px' };

const FindQuidditch = ({ clubs, events }) => {
  const { query: { postcode = '' } } = useRouter();

  return (
    <Layout>
      <Box
        as="section"
        position="relative"
        backgroundImage="url(https://images.prismic.io/chaser/187adf69-c199-4a01-82db-179bf9ed72c5_ET2_0158.jpg?auto=compress,format&rect=0,0,3360,1959&w=3360&h=1959)"
        backgroundColor="primary"
        backgroundSize="cover"
        backgroundPosition="center"
        minHeight={minHeight}
      >
        <Flex
          position="absolute"
          minHeight={minHeight}
          zIndex={1}
          bg="primary"
          opacity={0.2}
          width="100%"
        />

        <Flex
          position="relative"
          minHeight={minHeight}
          alignItems="center"
          justifyContent="center"
          zIndex={2}
        >
          <HeadingHero fontSize={[4, 5, 6]} color="white">Quidditch near {postcode}</HeadingHero>
        </Flex>
      </Box>

      <Box
        bg="greyLight"
        py={{ _: 6, l: 10 }}
        px={{ _: 0, m: 'gutter.m' }}
      >
        <Container>
          <Heading as="h2" fontSize={[3, 3, 4]} mt={0} px={{ _: 'gutter.s', m: '0' }} isBody color="primary">Clubs</Heading>

          <Heading as="h2" fontSize={[3, 3, 4]} mt={0} px={{ _: 'gutter.s', m: '0' }} isBody color="primary">Events</Heading>
        </Container>
        {clubs}
        {events}
      </Box>
    </Layout>
  );
};

FindQuidditch.defaultProps = {
  clubs: [],
  events: [],
};

FindQuidditch.propTypes = {
  clubs: PropTypes.arrayOf(PropTypes.shape({})),
  events: PropTypes.arrayOf(PropTypes.shape({})),
};

export const getServerSideProps = async ({ query }) => {
  // get events and clubs
  const { postcode } = query;

  if (!postcode) {
    return {
      props: { clubs: [], events: [] },
    };
  }

  return {
    props: { clubs: [], events: [] },
  };
};

FindQuidditch.propTypes = {};

export default FindQuidditch;
