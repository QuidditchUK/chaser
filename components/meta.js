import { useRouter } from 'next/router';
import Head from 'next/head';

const SITE_URL = 'https://quidditchuk.org'; // TODO: Use env variable

const Meta = ({
  subTitle = 'Find Your Passion',
  description = 'The official source for Quidditch UK news, highlights, results and more',
  image = `${SITE_URL}/open-graph.png`,
  title = 'QuidditchUK',
  type = 'website',
}) => {
  const { asPath } = useRouter();
  const url = `${SITE_URL}${asPath}`;
  const formattedTitle = subTitle ? `${subTitle} | ${title}` : title;

  return (
    <Head>
      <title>{title}</title>
      <link rel="canonical" href={url} />
      <meta name="description" content={description} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:title" content={formattedTitle} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
    </Head>
  );
};

export default Meta;
