import { getStaticPrismicProps } from 'modules/prismic';
import dynamic from 'next/dynamic';

const PrismicPage = dynamic(() => import('components/prismic-page'));

const Home = (props) => {
  return <PrismicPage type="pages" uid="home" {...props} />;
};

export const getStaticProps = async ({
  preview = null,
  previewData = { ref: null },
}) => {
  const prismicProps = await getStaticPrismicProps({
    previewData,
    type: 'pages',
    uid: 'home',
  });

  return {
    props: { ...prismicProps, preview },
    revalidate: 1,
  };
};

export default Home;
