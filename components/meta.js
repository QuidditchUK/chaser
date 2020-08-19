import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import PropTypes from 'prop-types';

const SITE_URL = 'https://quidditchuk.org'; // TODO: Use env variable

const Meta = ({
  subTitle,
  description,
  image,
  title,
  type,
}) => {
  const router = useRouter();
  const url = `${router.asPath}`;
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
      <meta property="og:url" content={`${SITE_URL}${url}`} />
    </Head>
  );
};

Meta.defaultProps = {
  description: 'The official source for Quidditch UK news, highlights, results and more',
  image: `${SITE_URL}/open-graph.png`,
  subTitle: 'Find Your Passion',
  title: 'QuidditchUK',
  type: 'website',
};

Meta.propTypes = {
  title: PropTypes.string,
  subTitle: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  type: PropTypes.string,
};

export default Meta;
