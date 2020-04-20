import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';

import withShell from '../../components/shell';
import { getDocs, getPrismicDocByUid } from '../../modules/prismic';
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

export const getStaticProps: GetStaticProps = async ({ params: { id } }) => {
  const uid = id.toString();
  const page = await getPrismicDocByUid('post', uid);

  return {
    props: { page }
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const allPages = await getDocs('post');

  return {
    paths: allPages?.map(({ uid }) => `/news/${uid}`),
    fallback: true,
  };
}

export default withShell(Post);
