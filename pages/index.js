import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { getPrismicDocByUid, formatMetadata, getDocs } from 'modules/prismic';
import renderPrismicSections from 'constants/prismic';

const Meta = dynamic(() => import('components/meta'));

const Home = ({ page, posts }) => (
  <>
    <Meta {...formatMetadata(page.data)} />
    <>{renderPrismicSections(page.data.body, posts)}</>
  </>
);

export const getStaticProps = async () => {
  const page = await getPrismicDocByUid('pages', 'home');
  const posts = await getDocs('post', { orderings: '[my.post.date desc]', pageSize: 6 });

  return {
    props: { page, posts },
    revalidate: 1,
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
