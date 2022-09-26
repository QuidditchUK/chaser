import { useRouter } from 'next/router';
import { getStaticPrismicProps, getDocs } from 'modules/prismic';
import dynamic from 'next/dynamic';

const PrismicPage = dynamic(() => import('components/shared/prismic-page'));

const Page = (props) => {
  const router = useRouter();
  return <PrismicPage type="programmes" uid={router.query.uid} {...props} />;
};

export const getStaticProps = async ({ params: { uid }, previewData }) => {
  const prismicProps = await getStaticPrismicProps({
    type: 'programmes',
    uid,
    previewData,
  });

  return {
    props: prismicProps,
    revalidate: 1,
  };
};

export const getStaticPaths = async () => {
  const allPages = await getDocs('programmes');

  return {
    paths: allPages?.map(({ uid }) => `/programmes/${uid}`),
    fallback: true,
  };
};

export default Page;
