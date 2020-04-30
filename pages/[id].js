import React from 'react';
import PropTypes from 'prop-types';
import { getPrismicDocByUid, getDocs, formatMetadata } from '~/modules/prismic';
import renderPrismicSections from '~/constants/prismic';
import Layout from '~/containers/layout';
import Meta from '~/components/meta';

const Page = ({ page }) => (
  <>
    {page
      ? (
        <Layout>
          <Meta {...formatMetadata(page.data)} />
          <>{renderPrismicSections(page.data.body)}</>
        </Layout>
      )
      : (<></>)}
  </>
);

export const getStaticProps = async ({ params: { id } }) => {
  const uid = id.toString();
  const page = await getPrismicDocByUid('pages', uid);

  return {
    props: { page },
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
