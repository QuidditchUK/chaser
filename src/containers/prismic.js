import React, { Suspense, lazy } from 'react';
import Skeleton from '../components/skeleton';

const HomeHero = lazy(() => import('../components/home-hero'));
const LatestNews = lazy(() => import('../components/latest-news'));

const types = {
  video_hero_with_cta: HomeHero,
  latest_news: LatestNews,
};

export default function (sections) {
  return sections.map((section, i) => {
    const Component = types[section.slice_type];

    if (!Component) {
      // eslint-disable-next-line no-console
      console.warn('Missing Prismic Component ID: ', section.slice_type);
      return null;
    }

    return (
      <Suspense fallback={<Skeleton />}>
        <Component key={`prismic${i}`} {...section} />
      </Suspense>
    );
  });
}
