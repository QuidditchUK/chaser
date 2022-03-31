import { useRouter } from 'next/router';
import { getStaticPrismicProps, getDocs } from 'modules/prismic';
import dynamic from 'next/dynamic';

const PrismicPage = dynamic(() => import('components/shared/prismic-page'));

const Page = (props) => {
  const router = useRouter();
  return <PrismicPage type="about" uid={router.query.uid} {...props} />;
};

export const getStaticProps = async ({
  params: { uid },
  preview = null,
  previewData = { ref: null },
}) => {
  const prismicProps = await getStaticPrismicProps({
    previewData,
    type: 'about',
    uid,
  });

  return {
    props: { ...prismicProps, preview },
    revalidate: 1,
  };
};

export const getStaticPaths = async () => {
  const allPages = await getDocs('about');

  return {
    paths: allPages?.map(({ uid }) => `/about/${uid}`),
    fallback: true,
  };
};

export default Page;
