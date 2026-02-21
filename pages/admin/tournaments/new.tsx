import { Box } from '@chakra-ui/react';

import { CLUBS_READ, CLUBS_WRITE, EMT } from 'constants/scopes';
import Slice from 'components/shared/slice';

import { isScoped_ServerProps } from 'modules/auth';
import { getBasePageProps } from 'modules/prismic';
import { GetServerSideProps } from 'next';
import HeadingWithBreadcrumbs from 'components/shared/HeadingWithBreadcrumbs';
import TournamentForm from 'components/admin/tournaments/tournament-form';

const CreateTournament = () => {
  return (
    <Slice>
      <HeadingWithBreadcrumbs
        breadcrumbs={[
          { link: '/admin', title: 'Dashboard' },
          { link: '/admin/tournaments', title: 'Tournaments' },
        ]}
        heading="New Tournament"
      />

      <TournamentForm />
    </Slice>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const auth = isScoped_ServerProps(context, [CLUBS_READ, CLUBS_WRITE, EMT]);
  if (!auth) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }

  return {
    props: await getBasePageProps(),
  };
};

export default CreateTournament;

CreateTournament.auth = {
  skeleton: <Box />,
};
