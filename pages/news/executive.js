import dynamic from 'next/dynamic';
import { getBlogCategory, PAGE_SIZE } from 'modules/prismic';

const LatestNews = dynamic(() => import('components/latest-news'));
const NewsHeader = dynamic(() => import('components/news-header'));
const Meta = dynamic(() => import('components/meta'));

const News = ({ posts = [] }) => (
  <>
    <Meta
      subTitle="Executive"
      description="All the news about the QuidditchUK Executive"
    />
    <NewsHeader />
    <LatestNews
      posts={posts}
      category="Executive"
      allowPagination
      horizontalScroll={false}
    />
  </>
);

export const getStaticProps = async () => {
  const posts = await getBlogCategory('Executive', {
    orderings: '[my.post.date desc]',
    pageSize: PAGE_SIZE,
  });

  return {
    props: { posts },
    revalidate: 1,
  };
};

export default News;
