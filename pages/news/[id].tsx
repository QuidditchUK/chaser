import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';

import { getDocs, getPrismicDocByUid, formatMetadata } from '../../modules/prismic';
import renderPrismicSections from '../../constants/prismic';
import Layout from '../../containers/layout';
import Meta from '../../components/meta';
import BlogHero from '../../components/blog-hero';
import BlogSupport from '../../components/blog-support';
import { Page } from '../../types';

const Post = ({ page }: Page) => (
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

export const getStaticProps: GetStaticProps = async ({ params: { id } }) => {
  const uid = id.toString();
  const page = await getPrismicDocByUid('post', uid);

  return {
    props: { page },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const allPages = await getDocs('post');

  return {
    paths: allPages?.map(({ uid }) => `/news/${uid}`),
    fallback: true,
  };
};

export default Post;
