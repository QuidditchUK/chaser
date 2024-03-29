import { useRouter } from 'next/router';
import { getStaticPrismicProps, getDocs } from 'modules/prismic';
import dynamic from 'next/dynamic';

const PrismicPage = dynamic(() => import('components/shared/prismic-page'));

const Page = (props) => {
  const router = useRouter();
  return <PrismicPage type="pages" uid={router.query.uid} {...props} />;
};

export const getStaticProps = async ({ params: { uid }, previewData }) => {
  const prismicProps = await getStaticPrismicProps({
    previewData,
    type: 'pages',
    uid,
  });

  return {
    props: prismicProps,
    revalidate: 1,
  };
};

export const getStaticPaths = async () => {
  const allPages = await getDocs('pages');

  // TODO: Need to find a better way to power this
  const nonPrismicPages = ['videos', 'clubs', 'merch', 'news', 'kitchen-sink'];
  const allPrismicPages = allPages.filter(
    ({ uid }) => !nonPrismicPages.includes(uid)
  );

  return {
    paths: allPrismicPages?.map(({ uid }) => `/${uid}`),
    fallback: true,
  };
};

export default Page;
