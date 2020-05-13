import React from 'react';
import PropTypes from 'prop-types';
import { getPrismicDocByUid, formatMetadata, getDocs } from '../modules/prismic';
import renderPrismicSections from '../constants/prismic';
import Layout from '../containers/layout';
import Meta from '../components/meta';

const Home = ({ page, posts }) => (
  <Layout>
    <Meta {...formatMetadata(page.data)} />
    <>{renderPrismicSections(page.data.body, posts)}</>
  </Layout>
);

export const getStaticProps = async () => {
  const page = await getPrismicDocByUid('pages', 'home');
  const posts = await getDocs('post', { orderings: '[my.post.date desc]', pageSize: 6 });

  return {
    props: { page, posts },
    unstable_revalidate: 1,
  };
};

Home.propTypes = {
  page: PropTypes.shape({
    data: PropTypes.shape({
      body: PropTypes.arrayOf(PropTypes.shape({})),
    }),
  }).isRequired,
  posts: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default Home;
