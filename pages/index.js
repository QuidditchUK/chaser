import SchedulerFeed from 'components/prismic/scheduler-feed';
import { getStaticPrismicProps } from 'modules/prismic';
import dynamic from 'next/dynamic';

const PrismicPage = dynamic(() => import('components/shared/prismic-page'));

const Home = (props) => (
  <>
    <PrismicPage type="pages" uid="home" {...props} />
    <SchedulerFeed
      primary={{
        scheduler_url: {
          url:
            'https://develop--quidditchscheduler.netlify.app/api/game/tournament/32',
        },
      }}
    />
  </>
);

export const getStaticProps = async ({
  preview = null,
  previewData = { ref: null },
}) => {
  const prismicProps = await getStaticPrismicProps({
    previewData,
    type: 'pages',
    uid: 'home',
  });

  return {
    props: { ...prismicProps, preview },
    revalidate: 1,
  };
};

export default Home;
