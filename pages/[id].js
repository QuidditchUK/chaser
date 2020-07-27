import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { getPrismicDocByUid, getDocs, formatMetadata } from 'modules/prismic';
import Meta from 'components/meta';
import PageLoading from 'components/page-loading';
import Page404 from 'pages/404';
import renderPrismicSections from 'constants/prismic';

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
  const page = await getPrismicDocByUid('pages', id, ref ? { ref } : null) || null;

  return {
    props: { page, preview },
    revalidate: 1,
  };
};

export const getStaticPaths = async () => {
  const allPages = await getDocs('pages');

  return {
    paths: allPages?.map(({ uid }) => `/${uid}`),
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
