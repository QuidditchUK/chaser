import dynamic from 'next/dynamic';

const HomeHero = dynamic(() => import('components/prismic/home-hero'));
const LatestNews = dynamic(() => import('components/prismic/latest-news'));
const Hero = dynamic(() => import('components/prismic/hero'));
const HeaderAndParagraph = dynamic(() =>
  import('components/prismic/header-and-paragraph')
);
const Images = dynamic(() => import('components/prismic/images'));
const ImageAndContent = dynamic(() =>
  import('components/prismic/image-and-content')
);
const Cards = dynamic(() => import('components/prismic/cards'));
const FindQuidditch = dynamic(() =>
  import('components/prismic/find-quidditch')
);
const Embed = dynamic(() => import('components/prismic/embeds'));
const EmbedAndContent = dynamic(() =>
  import('components/prismic/embed-and-content')
);
const ContactForm = dynamic(() =>
  import('components/prismic/forms/contact-form')
);
const TwoColumnTable = dynamic(() =>
  import('components/prismic/two-column-table-slice')
);
const VolunteerForm = dynamic(() =>
  import('components/prismic/forms/volunteer-form')
);
const NationalTeamForm = dynamic(() =>
  import('components/prismic/national-team-interest')
);
const HorizontalCard = dynamic(() =>
  import('components/prismic/horizontal-cards')
);
const EdiCommitteeForm = dynamic(() =>
  import('components/prismic/forms/edi-committee-form')
);

const slices = {
  video_hero_with_cta: HomeHero,
  latest_news: LatestNews,
  hero: Hero,
  header_and_paragraph: HeaderAndParagraph,
  images: Images,
  image_and_content: ImageAndContent,
  cards: Cards,
  find_quidditch: FindQuidditch,
  embed: Embed,
  embed_and_content: EmbedAndContent,
  contact_form: ContactForm,
  two_column_table: TwoColumnTable,
  volunteer_form: VolunteerForm,
  national_team_form: NationalTeamForm,
  horizontal_card: HorizontalCard,
  edi_committee_form: EdiCommitteeForm,
};

function PrismicSlice({ sections, posts }) {
  return sections.map((section, i) => {
    const Component = slices[section.slice_type];

    if (!Component) {
      console.warn('Missing Prismic Component ID: ', section.slice_type);
      return null;
    }

    return <Component key={`prismic${i}`} {...section} posts={posts} />;
  });
}

export default PrismicSlice;
