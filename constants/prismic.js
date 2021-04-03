import dynamic from 'next/dynamic';

const types = {
  video_hero_with_cta: dynamic(() => import('components/home-hero')),
  latest_news: dynamic(() => import('components/latest-news')),
  hero: dynamic(() => import('components/hero')),
  header_and_paragraph: dynamic(() =>
    import('components/header-and-paragraph')
  ),
  images: dynamic(() => import('components/image-slice')),
  image_and_content: dynamic(() => import('components/image-and-content')),
  cards: dynamic(() => import('components/cards')),
  find_quidditch: dynamic(() => import('components/find-quidditch')),
  embed: dynamic(() => import('components/embed-slice')),
  embed_and_content: dynamic(() => import('components/embed-and-content')),
  contact_form: dynamic(() => import('components/contact-form')),
  two_column_table: dynamic(() => import('components/two-column-table-slice')),
  volunteer_form: dynamic(() => import('components/volunteer-form')),
  national_team_form: dynamic(() => import('components/national-team-form')),
  horizontal_card: dynamic(() => import('components/horizontal-card')),
  edi_committee_form: dynamic(() => import('components/edi-committee-form')),
};

export default function Slice(sections, posts) {
  return sections.map((section, i) => {
    const Component = types[section.slice_type];

    if (!Component) {
      console.warn('Missing Prismic Component ID: ', section.slice_type);
      return null;
    }

    return <Component key={`prismic${i}`} {...section} posts={posts} />;
  });
}
