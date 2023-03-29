import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ClubCardV2 } from 'components/clubsEvents/club-card';

import { Flex } from '@chakra-ui/react';

import { getPrismicDocByUid } from 'modules/prismic';

const Card = dynamic(() => import('components/shared/card'));

const PrismicClubCard = ({
  uid,
  isStudentSummerPass,
}: {
  uid: string;
  isStudentSummerPass?: boolean;
}) => {
  const [data, setData] = useState(null);
  const [clubUid, setClubUid] = useState(uid);

  useEffect(() => {
    if ((!data || clubUid !== uid) && uid) {
      const getClub = async () => {
        try {
          const club = await getPrismicDocByUid('clubs', uid, null);

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
      <Flex flexDirection="column" height="100%">
        <Card height="100%" />
      </Flex>
    );
  }

  return (
    <ClubCardV2
      isStudentSummerPass={isStudentSummerPass}
      bg={data?.featured_color}
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
      tournament_results={data?.tournament_results}
    />
  );
};

export default PrismicClubCard;
