import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { getDocs, getStaticPrismicProps } from 'modules/prismic';
import PrismicSlice from 'components/prismic';

const Meta = dynamic(() => import('components/shared/meta'));
const NewsSupport = dynamic(() => import('components/news/news-support'));
const NewsHero = dynamic(() => import('components/news/news-hero'));
const SchemaArticle = dynamic(() => import('components/news/schema-article'));
const Page404 = dynamic(() => import('pages/404'));
const PageLoading = dynamic(() => import('components/shared/page-loading'));

const Post = ({ page }) => {
  const router = useRouter();

  if (router?.isFallback && !page) {
    return <PageLoading />;
  }

  if (!page && !preview) {
    return <Page404 />;
  }

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
        <NewsHero {...page?.data} />
        <PrismicSlice sections={page?.data.body} />
        <NewsSupport {...page?.data} tags={page?.tags} />
      </article>
    </>
  );
};

export const getStaticProps = async ({ params: { uid }, previewData }) => {
  const prismicProps = await getStaticPrismicProps({
    previewData,
    type: 'post',
    uid,
  });

  return {
    props: prismicProps,
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
