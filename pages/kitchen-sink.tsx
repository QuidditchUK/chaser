import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { Box } from '@chakra-ui/react';
import { getStaticPrismicProps } from 'modules/prismic';
import { DASHBOARD_SCOPES } from 'constants/scopes';
import { isScoped_ServerProps } from 'modules/auth';

const PrismicPage = dynamic(() => import('components/shared/prismic-page'));

const KitchenSink = (props) => (
  <PrismicPage type="pages" uid="kitchen-sink" {...props} />
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  const auth = isScoped_ServerProps(context, DASHBOARD_SCOPES);
  if (!auth) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: await getStaticPrismicProps({
      previewData: context.previewData,
      type: 'pages',
      uid: 'kitchen-sink',
    }),
  };
};

export default KitchenSink;

KitchenSink.auth = {
  skeleton: <Box />,
};
