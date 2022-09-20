import { getStaticPrismicProps } from 'modules/prismic';
import dynamic from 'next/dynamic';
import { DASHBOARD_SCOPES } from 'constants/scopes';
import isAuthorized from 'modules/auth';

const PrismicPage = dynamic(() => import('components/shared/prismic-page'));

const KitchenSink = (props) => (
  <PrismicPage type="pages" uid="kitchen-sink" {...props} />
);

export const getServerSideProps = async ({ req, res }) => {
  const auth = await isAuthorized(req, res, DASHBOARD_SCOPES);

  if (!auth) {
    return {
      props: {},
      // redirect: {
      //   permanent: false,
      //   destination: '/',
      // },
    };
  }

  const prismicProps = await getStaticPrismicProps({
    previewData: { ref: null },
    type: 'pages',
    uid: 'kitchen-sink',
  });

  return {
    props: { ...prismicProps, preview: null },
  };
};

export default KitchenSink;
