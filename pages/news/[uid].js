import dynamic from 'next/dynamic';

import { getDocs, getPrismicDocByUid, getBasePageProps } from 'modules/prismic';
import PrismicSlice from 'components/prismic';

const Page404 = dynamic(() => import('pages/404'));
const PageLoading = dynamic(() => import('components/shared/page-loading'));
const Meta = dynamic(() => import('components/shared/meta'));
const NewsSupport = dynamic(() => import('components/news/news-support'));
const NewsHero = dynamic(() => import('components/news/news-hero'));
const SchemaArticle = dynamic(() => import('components/news/schema-article'));

const Post = ({ page }) => {
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

export const getStaticProps = async ({ params: { uid }, previewData }) => {
  const basePageProps = await getBasePageProps();

  const page = (await getPrismicDocByUid('post', uid, previewData)) || null;

  return {
    props: { page, ...basePageProps },
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
