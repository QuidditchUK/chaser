import dynamic from 'next/dynamic';

import { Flex } from '@chakra-ui/react';

import { getPrismicDocByUid } from 'modules/prismic';
import { useEffect, useState } from 'react';

const Card = dynamic(() => import('components/shared/card'));
const ClubCard = dynamic(() => import('components/clubsEvents/club-card'));

const PrismicClubCard = ({ uid }) => {
  const [data, setData] = useState(null);
  const [clubUid, setClubUid] = useState(uid);

  useEffect(() => {
    if (!data || clubUid !== uid) {
      const getClub = async () => {
        try {
          const club = await getPrismicDocByUid('clubs', uid);

          setData(club?.data);
          setClubUid(uid);
        } catch (err) {
          throw err;
        }
      };

      getClub();
    }
  }, [data, setData, uid, clubUid]);

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
