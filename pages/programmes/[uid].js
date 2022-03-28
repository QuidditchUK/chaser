import { useRouter } from 'next/router';
import { getStaticPrismicProps, getDocs } from 'modules/prismic';
import dynamic from 'next/dynamic';

const PrismicPage = dynamic(() => import('components/prismic-page'));

const Page = (props) => {
  const router = useRouter();
  return <PrismicPage type="programmes" uid={router.query.uid} {...props} />;
};

export const getStaticProps = async ({
  params: { uid },
  locale,
  locales,
  preview = null,
  previewData = { ref: null },
}) => {
  const prismicProps = await getStaticPrismicProps({
    previewData,
    type: 'programmes',
    uid,
    lang: locale,
    locales,
  });

  return {
    props: { ...prismicProps, preview },
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
