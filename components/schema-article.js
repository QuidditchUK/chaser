import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import get from 'just-safe-get';

const SchemaArticle = ({ page }) => {
  const data = get(page, 'data');
  const published = get(page, 'first_publication_date');
  const updated = get(page, 'last_publication_date');
  const image = get(page, 'data.image');

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              '@context': 'https://schema.org',
              '@type': 'NewsArticle',
              headline: data?.title,
              image: image?.url,
              datePublished: new Date(published).toISOString(),
              dateModified: new Date(updated).toISOString(),
            },
          ),
        }}
      />
    </Head>
  );
};

SchemaArticle.propTypes = {
  page: PropTypes.shape({}).isRequired,
};

export default SchemaArticle;
