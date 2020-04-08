import React from 'react';

import HeroVideoWithCTA from '../components/HeroVideoWithCTA';

const types = {
  video_hero_with_cta: HeroVideoWithCTA,
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
      <Component key={`prismic${i}`} {...section} />
    );
  });
}
