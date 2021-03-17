import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';

import { getDocs, getPrismicDocByUid, formatMetadata } from 'modules/prismic';
import renderPrismicSections from 'constants/prismic';

const Page404 = dynamic(() => import('pages/404'));
const PageLoading = dynamic(() => import('components/page-loading'));
const Meta = dynamic(() => import('components/meta'));
const BlogSupport = dynamic(() => import('components/blog-support'));
const BlogHero = dynamic(() => import('components/blog-hero'));
const SchemaArticle = dynamic(() => import('components/schema-article'));

const Post = ({ page: initialPage, preview }) => {
  const router = useRouter();

  const { data: queryData } = useQuery(
    ['post', router.query.id],
    () => getPrismicDocByUid('post', router.query.id),
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
        <BlogHero {...page.data} />
        {renderPrismicSections(page.data.body)}
        <BlogSupport {...page.data} tags={page.tags} />
      </article>
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
    (await getPrismicDocByUid('post', id, ref ? { ref } : null)) || null;

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
