import dynamic from 'next/dynamic';

const HomeHero = dynamic(() => import('components/home-hero'));
const LatestNews = dynamic(() => import('components/latest-news'));
const Hero = dynamic(() => import('components/hero'));
const HeaderAndParagraph = dynamic(() =>
  import('components/header-and-paragraph')
);
const Images = dynamic(() => import('components/image-slice'));
const ImageAndContent = dynamic(() => import('components/image-and-content'));
const Cards = dynamic(() => import('components/cards'));
const FindQuidditch = dynamic(() => import('components/find-quidditch'));
const Embed = dynamic(() => import('components/embed-slice'));
const EmbedAndContent = dynamic(() => import('components/embed-and-content'));
const ContactForm = dynamic(() => import('components/contact-form'));
const TwoColumnTable = dynamic(() =>
  import('components/two-column-table-slice')
);
const VolunteerForm = dynamic(() => import('components/volunteer-form'));
const NationalTeamForm = dynamic(() =>
  import('components/national-team-interest')
);
const HorizontalCard = dynamic(() => import('components/horizontal-card'));
const EdiCommitteeForm = dynamic(() => import('components/edi-committee-form'));

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
