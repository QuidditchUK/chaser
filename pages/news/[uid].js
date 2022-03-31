import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';

import { getDocs, getPrismicDocByUid, formatMetadata } from 'modules/prismic';
import PrismicSlice from 'components/prismic';

const Page404 = dynamic(() => import('pages/404'));
const PageLoading = dynamic(() => import('components/shared/page-loading'));
const Meta = dynamic(() => import('components/shared/meta'));
const NewsSupport = dynamic(() => import('components/news/news-support'));
const NewsHero = dynamic(() => import('components/news/news-hero'));
const SchemaArticle = dynamic(() => import('components/news/schema-article'));

const Post = ({ page: initialPage, preview }) => {
  const router = useRouter();

  const { data: queryData } = useQuery(
    ['post', router.query.uid],
    () => getPrismicDocByUid('post', router.query.uid),
    { initialData: initialPage, enabled: !preview }
  );

  if (router.isFallback && !queryData) {
    return <PageLoading />;
  }

  if (!queryData && !preview) {
    return <Page404 />;
  }

  const page = preview ? initialPage : queryData;

  return (
    <>
      <Meta {...formatMetadata(page.data)} />
      <SchemaArticle page={page} />
      <article>
        <NewsHero {...page.data} />
        <PrismicSlice sections={page.data.body} />
        <NewsSupport {...page.data} tags={page.tags} />
      </article>
    </>
  );
};

export const getStaticProps = async ({
  params: { uid },
  preview = null,
  previewData = {},
}) => {
  const { ref } = previewData;
  const page =
    (await getPrismicDocByUid('post', uid, ref ? { ref } : null)) || null;

  return {
    props: { page, preview },
    revalidate: 1,
  };
};

export const getStaticPaths = async () => {
  const allPages = await getDocs('post');

  return {
    paths: allPages?.map(({ uid }) => `/news/${uid}`),
    fallback: true,
  };
};

export default Post;
