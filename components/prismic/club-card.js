import dynamic from 'next/dynamic';

import { Flex } from '@chakra-ui/react';

import { getPrismicDocByUid } from 'modules/prismic';
import { useEffect, useState } from 'react';

const Card = dynamic(() => import('components/shared/card'));
const ClubCard = dynamic(() => import('components/clubsEvents/club-card'));

const PrismicClubCard = ({ uid }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!data) {
      const getClub = async () => {
        const { data } = await getPrismicDocByUid('clubs', uid);

        setData(data);
      };

      getClub();
    }
  }, [data, setData, uid]);

  if (!data) {
    return (
      <Flex flexDirection="column">
        <Card />
      </Flex>
    );
  }

  return (
    <ClubCard
      backgroundColor={data?.featured_color}
      color={data?.text_color}
      title={data?.club_name}
      href={`/clubs/${uid}`}
      league={data?.league}
      venue={data?.venue}
      icon={data?.icon?.url}
      status={data?.active}
      image={{
        src: data?.images?.[0].image?.url,
        alt: data?.name,
      }}
    />
  );
};

export default PrismicClubCard;
