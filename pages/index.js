import React from 'react';
import PropTypes from 'prop-types';

import withShell from '../components/shell';
import { Client as PrismicClient } from '../modules/prismic';
import renderPrismicSections from '../constants/prismic';
import Layout from '../containers/layout';
import Meta from '../components/meta';

import { formatMetadata } from '../modules/prismic';

const Home = ({ page: { data } }) => (
  <Layout>
    <Meta {...formatMetadata(data)} />
    <>{renderPrismicSections(data.body)}</>
  </Layout>
);

Home.getInitialProps = async ({ res, req }) => {
  const page = await PrismicClient(req).getByUID('pages', 'home');


  if (res && !page) {
    res.writeHead(404);
    res.end();
    return;
  }

  return { page };
};

Home.propTypes = {
  page: PropTypes.shape({
    data: PropTypes.shape({
      body: PropTypes.shape({}),
    }),
  }).isRequired,
};

export default withShell(Home);
