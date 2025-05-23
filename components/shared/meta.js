import { useRouter } from 'next/router';
import Head from 'next/head';

const SITE_URL = 'https://quadballuk.org'; // TODO: Use env variable

const Meta = ({
  subTitle = 'Sport For Anyone',
  description = 'The official source for Quadball UK news, highlights, results and more',
  image = `${SITE_URL}/open-graph.png`,
  title = 'QuadballUK',
  type = 'website',
}) => {
  const { asPath } = useRouter();
  const url = `${SITE_URL}${asPath}`;
  const formattedTitle = subTitle ? `${subTitle} | ${title}` : title;

  return (
    <Head>
      <title>{formattedTitle}</title>
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
