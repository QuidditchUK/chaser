import dynamic from 'next/dynamic';

import { Heading, Link } from '@chakra-ui/react';

const Slice = dynamic(() => import('components/shared/slice'));

const NationalTeamInterest = ({ slice }) => {
  const { primary } = slice;
  return (
    <Slice variant={primary?.variant}>
      <Heading as="h2" fontFamily="body" textAlign="center">
        Register your interest today through your{' '}
        <Link href="/login">QuadballUK account</Link>, by completing your{' '}
        <Link href="/dashboard/account/national-team">
          National Team Profile
        </Link>
        !
      </Heading>
    </Slice>
  );
};

export default NationalTeamInterest;
