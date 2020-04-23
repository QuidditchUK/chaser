import React from 'react';
import PropTypes from 'prop-types';

import { getDocs, getPrismicDocByUid, formatMetadata } from '../../modules/prismic';
import renderPrismicSections from '../../constants/prismic';
import Layout from '../../containers/layout';
import Meta from '../../components/meta';
import BlogHero from '../../components/blog-hero';
import BlogSupport from '../../components/blog-support';

const Post = ({ page }) => (
  <>
    {page
      ? (
        <Layout>
          <Meta {...formatMetadata(page.data)} />

          <article>
            <BlogHero {...page.data} />
            {renderPrismicSections(page.data.body)}
            <BlogSupport {...page.data} />
          </article>
        </Layout>
      )
      : (<></>)}
  </>
);

export const getStaticProps = async ({ params: { id } }) => {
  const uid = id.toString();
  const page = await getPrismicDocByUid('post', uid);

  return {
    props: { page },
  };
};

export const getStaticPaths = async () => {
  const allPages = await getDocs('post');

  return {
    paths: allPages?.map(({ uid }) => `/news/${uid}`),
    fallback: true,
  };
};

Post.propTypes = {
  page: PropTypes.shape({
    data: PropTypes.shape({
      body: PropTypes.arrayOf(PropTypes.shape({})),
    }),
  }).isRequired,
};

export default Post;
