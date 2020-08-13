import React from 'react';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

import { getDocs, getPrismicDocByUid, formatMetadata } from 'modules/prismic';
import renderPrismicSections from 'constants/prismic';

const Page404 = dynamic(() => import('pages/404'));
const PageLoading = dynamic(() => import('components/page-loading'));
const Meta = dynamic(() => import('components/meta'));
const BlogSupport = dynamic(() => import('components/blog-support'));
const BlogHero = dynamic(() => import('components/blog-hero'));
const SchemaArticle = dynamic(() => import('components/schema-article'));

const Post = ({ page }) => {
  const router = useRouter();

  if (router.isFallback) {
    return (<PageLoading />);
  }

  if (!page) {
    return <Page404 />;
  }

  return (
    <>
      <Meta {...formatMetadata(page.data)} />
      <SchemaArticle page={page} />
      <article>
        <BlogHero {...page.data} />
        {renderPrismicSections(page.data.body)}
        <BlogSupport {...page.data} tags={page.tags} />
      </article>
    </>
  );
};

export const getStaticProps = async ({ params: { id }, preview = null, previewData = {} }) => {
  const { ref } = previewData;
  const page = await getPrismicDocByUid('post', id, ref ? { ref } : null) || null;

  return {
    props: { page, preview },
    revalidate: 1,
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
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default Post;
