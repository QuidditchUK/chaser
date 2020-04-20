import * as React from 'react';
import PropTypes from 'prop-types';
import { GetStaticProps } from 'next';

import { getPrismicDocByUid, formatMetadata } from '../modules/prismic';
import renderPrismicSections from '../constants/prismic';
import Layout from '../containers/layout';
import Meta from '../components/meta';

const Home = ({ page }) => (
  <Layout>
    <Meta {...formatMetadata(page.data)} />
    <>{renderPrismicSections(page.data.body)}</>
  </Layout>
);

Home.propTypes = {
  page: PropTypes.shape({
    data: PropTypes.shape({
      body: PropTypes.array,
    }),
  }).isRequired,
};

export const getStaticProps: GetStaticProps = async () => {
  const page = await getPrismicDocByUid('pages', 'home');
  return {
    props: { page },
  };
};

export default Home;
