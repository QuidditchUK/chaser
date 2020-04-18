import React from 'react';
import PropTypes from 'prop-types';

import withShell from '../../components/shell';
import { Client as PrismicClient } from '../../modules/prismic';
import renderPrismicSections from '../../constants/prismic';
import Layout from '../../containers/layout';
import Meta from '../../components/meta';
import BlogHero from '../../components/blog-hero';
import BlogSupport from '../../components/blog-support';
import { formatMetadata } from '../../modules/prismic';

const Post = ({ page: { data } }) => (
  <Layout>
    <Meta {...formatMetadata(data)} />
    <article>
      <BlogHero {...data} />
      {renderPrismicSections(data.body)}
      <BlogSupport {...data} />
    </article>
  </Layout>
);

Post.getInitialProps = async ({ res, req, query: { id } }) => {
  const page = await PrismicClient(req).getByUID('post', id);


  if (res && !page) {
    res.writeHead(404);
    res.end();
    return;
  }

  return { page };
};

Post.propTypes = {
  page: PropTypes.shape({
    data: PropTypes.shape({
      body: PropTypes.array,
    }),
  }).isRequired,
};

export default withShell(Post);
