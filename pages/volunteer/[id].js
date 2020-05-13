import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Page404 from 'pages/404';

import { getPrismicDocByUid, getDocs, formatMetadata } from 'modules/prismic';
import renderPrismicSections from 'constants/prismic';
import Layout from 'containers/layout';
import Meta from 'components/meta';
import PageLoading from 'components/page-loading';

const Page = ({ page }) => {
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
      <>{renderPrismicSections(page.data.body)}</>
    </Layout>
  );
};

export const getStaticProps = async ({ params: { id } }) => {
  const page = await getPrismicDocByUid('volunteer', id) || null;

  return {
    props: { page },
    unstable_revalidate: 1,
  };
};

export const getStaticPaths = async () => {
  const allPages = await getDocs('volunteer');

  return {
    paths: allPages?.map(({ uid }) => `/volunteer/${uid}`),
    fallback: true,
  };
};

Page.propTypes = {
  page: PropTypes.shape({
    data: PropTypes.shape({
      body: PropTypes.arrayOf(PropTypes.shape({})),
    }),
  }).isRequired,
};

export default Page;
