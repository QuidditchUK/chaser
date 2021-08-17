import dynamic from 'next/dynamic';

import get from 'just-safe-get';
import { Heading, Link } from '@chakra-ui/react';

const PrismicWrapper = dynamic(() => import('components/prismic-wrapper'));

const NationalTeamInterest = (rawData) => {
  const variant = get(rawData, 'primary.variant');
  return (
    <PrismicWrapper variant={variant}>
      <Heading as="h1" fontFamily="body" textAlign="center">
        Register your interest today through your{' '}
        <Link href="/login">QuidditchUK account</Link>, by completing your{' '}
        <Link href="/dashboard/account/national-team">
          National Team Profile
        </Link>
        !
      </Heading>
    </PrismicWrapper>
  );
};

export default NationalTeamInterest;
