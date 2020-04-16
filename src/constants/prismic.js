/* eslint-disable react/no-array-index-key */
import React, { Suspense, lazy } from 'react';
import Skeleton from '../components/skeleton';

const HomeHero = lazy(() => import('../components/home-hero'));
const Hero = lazy(() => import('../components/hero'));
const LatestNews = lazy(() => import('../components/latest-news'));
const HeaderAndParagraph = lazy(() => import('../components/header-and-paragraph'));
const ImageSlice = lazy(() => import('../components/image-slice'));
const ImageAndContent = lazy(() => import('../components/image-and-content'));

const types = {
  video_hero_with_cta: HomeHero,
  latest_news: LatestNews,
  hero: Hero,
  header_and_paragraph: HeaderAndParagraph,
  image: ImageSlice,
  image_and_content: ImageAndContent,
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
