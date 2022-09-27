import { GetStaticProps } from 'next';
import { getStaticPrismicProps } from '../modules/prismic';
import dynamic from 'next/dynamic';

const PrismicPage = dynamic(() => import('../components/shared/prismic-page'));

const Home = (props) => <PrismicPage type="pages" uid="home" {...props} />;

export const getStaticProps: GetStaticProps = async ({ previewData }) => {
  const prismicProps = await getStaticPrismicProps({
    previewData,
    type: 'pages',
    uid: 'home',
  });

  return {
    props: prismicProps,
    revalidate: 1,
  };
};

export default Home;
