import dynamic from 'next/dynamic';

import get from 'just-safe-get';
import { Heading, Link } from '@chakra-ui/react';

const Slice = dynamic(() => import('components/slice'));

const NationalTeamInterest = (rawData) => {
  const variant = get(rawData, 'primary.variant');
  return (
    <Slice variant={variant}>
      <Heading as="h1" fontFamily="body" textAlign="center">
        Register your interest today through your{' '}
        <Link href="/login">QuidditchUK account</Link>, by completing your{' '}
        <Link href="/dashboard/account/national-team">
          National Team Profile
        </Link>
        !
      </Heading>
    </Slice>
  );
};

export default NationalTeamInterest;
