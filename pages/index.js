import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { getPrismicDocByUid, formatMetadata, getDocs } from 'modules/prismic';
import renderPrismicSections from 'constants/prismic';
import { useQuery } from 'react-query';

const Meta = dynamic(() => import('components/meta'));
const Page404 = dynamic(() => import('pages/404'));
const PageLoading = dynamic(() => import('components/page-loading'));

const Home = ({ page: initialPage, posts: initialPosts, preview }) => {
  const router = useRouter();
  const { data: queryData } = useQuery(
    ['pages', 'home'],
    () => getPrismicDocByUid('pages', 'home'),
    { initialData: initialPage }
  );
  const { data: posts } = useQuery(
    ['post', 'home'],
    () =>
      getDocs('post', {
        orderings: '[my.post.date desc]',
        pageSize: 6,
      }),
    { initialData: initialPosts }
  );

  const page = preview ? initialPage : queryData;

  if (router.isFallback && !queryData) {
    return <PageLoading />;
  }

  if (!queryData && !preview) {
    return <Page404 />;
  }

  return (
    <>
      <Meta {...formatMetadata(page.data)} />
      <>{renderPrismicSections(page.data.body, posts)}</>
    </>
  );
};

export const getStaticProps = async () => {
  const page = await getPrismicDocByUid('pages', 'home');
  const posts = await getDocs('post', {
    orderings: '[my.post.date desc]',
    pageSize: 6,
  });

  return {
    props: { page, posts },
    revalidate: 1,
  };
};

export default Home;
