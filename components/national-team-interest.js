import dynamic from 'next/dynamic';

import get from 'just-safe-get';
import { Heading, Link } from '@chakra-ui/react';

const PrismicWrapper = dynamic(() => import('components/prismic-wrapper'));

const NationalTeamInterest = (rawData) => {
  const variant = get(rawData, 'primary.variant');
  return (
    <PrismicWrapper variant={variant}>
      <Heading as="h1" fontFamily="body" textAlign="center">
        Excited for the National Teams? Check out the details of our new{' '}
        <Link href="/programmes/scouting">Scouting Program</Link>, and get
        yourself ready to apply when the season starts.
      </Heading>
    </PrismicWrapper>
  );
};

export default NationalTeamInterest;
