import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import get from 'just-safe-get';
import formatISO from 'date-fns/formatISO';
import parseJSON from 'date-fns/parseJSON';

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
              datePublished: formatISO(parseJSON(published)),
              dateModified: formatISO(parseJSON(updated)),
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
