import React from 'react';
import PropTypes from 'prop-types';

import withShell from '../components/shell';
import { Client as PrismicClient } from '../modules/prismic';
import renderPrismicSections from '../constants/prismic';
import Layout from '../containers/layout';
import Meta from '../components/meta';

import { formatMetadata } from '../modules/prismic';

const Page = ({ page: { data } }) => (
  <Layout>
    <Meta {...formatMetadata(data)} />
    <>{renderPrismicSections(data.body)}</>
  </Layout>
);

Page.getInitialProps = async ({ res, req, query: { id } }) => {
  const page = await PrismicClient(req).getByUID('pages', id);


  if (res && !page) {
    res.writeHead(404);
    res.end();
    return;
  }

  return { page };
};

Page.propTypes = {
  page: PropTypes.shape({
    data: PropTypes.shape({
      body: PropTypes.shape({}),
    }),
  }).isRequired,
};

export default withShell(Page);
