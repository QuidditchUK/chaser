/* eslint-disable react/no-danger */
import Head from 'next/head';

const SchemaClub = ({ club }) => {
  const location = club?.coordinates;

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SportsClub',
            '@id': `https://quadballuk.org/clubs/${club.uid}`,
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
            url: `https://quadballuk.org/clubs/${club.uid}`,
            priceRange: '£',
          }),
        }}
      />
    </Head>
  );
};

export default SchemaClub;
