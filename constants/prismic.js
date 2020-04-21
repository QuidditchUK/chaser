import React from 'react';
import dynamic from 'next/dynamic';

const HomeHero = dynamic(() => import('../components/home-hero'));
const Hero = dynamic(() => import('../components/hero'));
const LatestNews = dynamic(() => import('../components/latest-news'));
const HeaderAndParagraph = dynamic(() => import('../components/header-and-paragraph'));
const ImageSlice = dynamic(() => import('../components/image-slice'));
const ImageAndContent = dynamic(() => import('../components/image-and-content'));

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
      console.warn('Missing Prismic Component ID: ', section.slice_type);
      return null;
    }

    return (
      <Component key={`prismic${i}`} {...section} />
    );
  });
}
