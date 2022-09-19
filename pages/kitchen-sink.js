import { getStaticPrismicProps } from 'modules/prismic';
import dynamic from 'next/dynamic';

const PrismicPage = dynamic(() => import('components/shared/prismic-page'));

const KitchenSink = (props) => (
  <PrismicPage type="pages" uid="kitchen-sink" {...props} />
);

export const getServerSideProps = async ({
  preview = null,
  previewData = { ref: null },
}) => {
  const auth = await isAuthorized(req, res, DASHBOARD_SCOPES);
  if (!auth) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const prismicProps = await getStaticPrismicProps({
    previewData,
    type: 'pages',
    uid: 'kitchen-sink',
  });

  return {
    props: { ...prismicProps, preview },
    revalidate: 1,
  };
};

export default KitchenSink;
