import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ClubShape } from 'components/club-card';

const SchemaClub = ({ club }) => {
  const location = JSON.parse(club?.coordinates);

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              '@context': 'https://schema.org',
              '@type': 'SportsClub',
              '@id': `https://quidditchuk.org/clubs/${club.slug}`,
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'UK',
              },
              image: club?.images[0],
              name: club?.name,
              geo: {
                latitude: location?.coordinates[1],
                longitude: location?.coordinates[0],
              },
              url: `https://quidditchuk.org/clubs/${club.slug}`,
              priceRange: '£',
            },
          ),
        }}
      />
    </Head>
  );
};

SchemaClub.propTypes = {
  club: PropTypes.shape(ClubShape).isRequired,
};

export default SchemaClub;
