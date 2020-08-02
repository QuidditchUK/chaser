import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

import { getPrismicDocByUid, getDocs, formatMetadata } from 'modules/prismic';
import renderPrismicSections from 'constants/prismic';

const Page404 = dynamic(() => import('pages/404'));
const PageLoading = dynamic(() => import('components/page-loading'));
const Meta = dynamic(() => import('components/meta'));

const Page = ({ page }) => {
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
      <>{renderPrismicSections(page.data.body)}</>
    </>
  );
};

export const getStaticProps = async ({ params: { id }, preview = null, previewData = {} }) => {
  const { ref } = previewData;
  const page = await getPrismicDocByUid('volunteer', id, ref ? { ref } : null) || null;

  return {
    props: { page, preview },
    revalidate: 1,
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
