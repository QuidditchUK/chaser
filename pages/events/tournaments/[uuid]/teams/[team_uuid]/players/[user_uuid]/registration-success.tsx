import { GetServerSideProps } from 'next';

import { Box, Text } from '@chakra-ui/react';
import Slice from 'components/shared/slice';
import Meta from 'components/shared/meta';

const RegistrationSuccessPage = () => {
  return (
    <>
      <Meta title="Tournament Player Registration Purchase successful" />
      <Slice>
        <Text>Purchase successful. Redirecting to player registration...</Text>
      </Slice>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    redirect: {
      destination: `/events/tournaments/${context.params.uuid}/teams/${context.params.team_uuid}/players/${context.params.user_uuid}`,
      permanent: false,
    },
  };
};

export default RegistrationSuccessPage;

RegistrationSuccessPage.auth = {
  skeleton: <Box />,
};
