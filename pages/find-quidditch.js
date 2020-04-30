import React from 'react';
// import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Layout from '~/containers/layout';
import { Box } from '~/components/layout';
// import { formatMetadata } from '../modules/prismic';
// import Meta from '../components/meta';

const FindQuidditch = () => {
  const { query: { postcode = '' } } = useRouter();

  return (
    <Layout>
      <Box
        bg="greyLight"
        py={{ _: 6, l: 10 }}
        px={{ _: 0, m: 'gutter.m' }}
      >
        Quidditch near {postcode}
      </Box>
    </Layout>
  );
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
