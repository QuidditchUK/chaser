import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Page404 from '~/pages/404';

import { getDocs, getPrismicDocByUid, formatMetadata } from '~/modules/prismic';
import renderPrismicSections from '~/constants/prismic';
import Layout from '~/containers/layout';
import Meta from '~/components/meta';
import BlogHero from '~/components/blog-hero';
import BlogSupport from '~/components/blog-support';
import PageLoading from '~/components/page-loading';

const Post = ({ page }) => {
  const router = useRouter();

  if (router.isFallback) {
    return (<PageLoading />);
  }

  if (!page) {
    return <Page404 />;
  }

  return (
    <Layout>
      <Meta {...formatMetadata(page.data)} />

      <article>
        <BlogHero {...page.data} />
        {renderPrismicSections(page.data.body)}
        <BlogSupport {...page.data} />
      </article>
    </Layout>
  );
};

export const getStaticProps = async ({ params: { id } }) => {
  const page = await getPrismicDocByUid('post', id) || null;

  return {
    props: { page },
    unstable_revalidate: 1,
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
