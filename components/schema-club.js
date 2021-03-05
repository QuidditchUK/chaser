/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

const SchemaClub = ({ club }) => {
  const location = club?.coordinates;

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              '@context': 'https://schema.org',
              '@type': 'SportsClub',
              '@id': `https://quidditchuk.org/clubs/${club.uid}`,
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'UK',
              },
              image: club?.images?.[0]?.image?.url,
              name: club?.club_name,
              geo: {
                latitude: location?.latitude,
                longitude: location?.longitude,
              },
              url: `https://quidditchuk.org/clubs/${club.uid}`,
              priceRange: '£',
            },
          ),
        }}
      />
    </Head>
  );
};

SchemaClub.propTypes = {
  club: PropTypes.shape({
    uid: PropTypes.string,
    club_name: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.shape({
      image: PropTypes.shape({
        url: PropTypes.string,
      }),
    })),
    coordinates: PropTypes.shape({}),
  }).isRequired,
};

export default SchemaClub;
