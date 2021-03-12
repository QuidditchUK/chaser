import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useQuery } from 'react-query';

import { getPrismicDocByUid, getDocs, formatMetadata } from 'modules/prismic';
import renderPrismicSections from 'constants/prismic';

const Page404 = dynamic(() => import('pages/404'));
const PageLoading = dynamic(() => import('components/page-loading'));
const Meta = dynamic(() => import('components/meta'));

const Page = ({ page: initialPage }) => {
  const router = useRouter();
  const { data: page } = useQuery(
    ['volunteer', router.query.id],
    () => getPrismicDocByUid('volunteer', router.query.id),
    { initialData: initialPage }
  );

  if (router.isFallback) {
    return <PageLoading />;
  }

  if (!page) {
    return <Page404 />;
  }

  return (
    <>
      <Meta {...formatMetadata(page.data)} />
      <>{renderPrismicSections(page.data.body)}</>
    </>
  );
};

export const getStaticProps = async ({
  params: { id },
  preview = null,
  previewData = {},
}) => {
  const { ref } = previewData;
  const page =
    (await getPrismicDocByUid('volunteer', id, ref ? { ref } : null)) || null;

  return {
    props: { page, preview },
    revalidate: 1,
  };
};

export const getStaticPaths = async () => {
  const allPages = await getDocs('volunteer');

  return {
    paths: allPages?.map(({ uid }) => `/volunteer/${uid}`),
    fallback: true,
  };
};

export default Page;
