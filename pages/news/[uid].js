import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import { getDocs, getPrismicDocByUid, getBasePageProps } from 'modules/prismic';
import PrismicSlice from 'components/prismic';
import useCachedResponse from 'hooks/useCachedResponse';

const Page404 = dynamic(() => import('pages/404'));
const PageLoading = dynamic(() => import('components/shared/page-loading'));
const Meta = dynamic(() => import('components/shared/meta'));
const NewsSupport = dynamic(() => import('components/news/news-support'));
const NewsHero = dynamic(() => import('components/news/news-hero'));
const SchemaArticle = dynamic(() => import('components/news/schema-article'));

const Post = ({ page: initialPage, preview }) => {
  const router = useRouter();

  const { data: queryData } = useCachedResponse({
    queryKey: ['post', router.query.uid],
    queryFn: () => getPrismicDocByUid('post', router.query.uid),
    selector: (res) => res,
    initialData: initialPage,
    enabled: !preview,
  });

  if (router.isFallback && !queryData) {
    return <PageLoading />;
  }

  if (!queryData && !preview) {
    return <Page404 />;
  }

  const page = preview ? initialPage : queryData;

  const metaData = {
    description: page?.data?.meta_description,
    subTitle: page?.data?.meta_title || page?.data?.title,
    image: page?.data?.meta_image.url || page?.data?.image?.url,
  };

  return (
    <>
      <Meta {...metaData} />
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
  const basePageProps = await getBasePageProps();
  const { ref } = previewData;
  const page =
    (await getPrismicDocByUid('post', uid, ref ? { ref } : null)) || null;

  return {
    props: { page, preview, ...basePageProps },
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
