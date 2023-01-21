import dynamic from 'next/dynamic';
import { Box, Flex, Heading, Grid, Divider, Text } from '@chakra-ui/react';

import { getBasePageProps } from 'modules/prismic';
import { GetServerSideProps } from 'next';
import useMe from 'hooks/useMe';
import SkeletonLoaderWrapper from 'components/shared/SkeletonLoaderWrapper';

const Logo = dynamic(() => import('components/shared/logo'));
const Meta = dynamic(() => import('components/shared/meta'));
const Container = dynamic(() => import('components/layout/container'));

const InfoForm = dynamic(() => import('components/dashboard/info-form'));
const PasswordForm = dynamic(
  () => import('components/dashboard/password-form')
);
const NotificationForm = dynamic(
  () => import('components/dashboard/notification-form')
);
const PushNotificationForm = dynamic(
  () => import('components/dashboard/push-notification-form')
);

const Info = () => {
  const { data: user, isLoading } = useMe();

  return (
    <>
      <Meta
        description="Sign in to QuadballUK to manage your QuadballUK Membership, Account details and more"
        subTitle="My info"
      />
      <SkeletonLoaderWrapper loaderComponent={<Box />} isLoading={isLoading}>
        <Box
          bg="greyLight"
          py={{ base: 4, lg: 10 }}
          px={{ base: 4, sm: 8, md: 9 }}
        >
          <Container>
            <Flex justifyContent="center" alignItems="center">
              <Logo />
            </Flex>
            <Heading as="h1" fontFamily="body" textAlign="center">
              Update your Info
            </Heading>

            <Grid
              gridGap={4}
              gridTemplateColumns={{ base: '1fr', md: '1fr 1fr 1fr' }}
            >
              <Box bg="gray.100" borderRadius="lg" p={4}>
                <Heading
                  as="h3"
                  fontFamily="body"
                  color="qukBlue"
                  fontSize="xl"
                  mt={0}
                >
                  Change your details
                </Heading>
                <InfoForm user={user} />
              </Box>

              <Grid
                bg="gray.100"
                borderRadius="lg"
                p={4}
                height="100%"
                gridTemplateRows="min-content 1fr"
              >
                <Heading
                  as="h3"
                  fontFamily="body"
                  color="qukBlue"
                  fontSize="xl"
                  mt={0}
                >
                  Change your password
                </Heading>

                <PasswordForm />
              </Grid>

              <Grid
                bg="gray.100"
                borderRadius="lg"
                p={4}
                height="100%"
                gridTemplateRows="min-content min-content min-content auto"
              >
                <Heading
                  as="h3"
                  fontFamily="body"
                  color="qukBlue"
                  fontSize="xl"
                  mt={0}
                >
                  Notification Settings
                </Heading>
                <NotificationForm user={user} />
                <Divider
                  borderBottomWidth="1px"
                  borderBottomColor="gray.300"
                  py={3}
                />
                <Grid
                  gridTemplateRows="min-content min-content auto"
                  height="100%"
                >
                  <Heading
                    as="h3"
                    fontFamily="body"
                    color="qukBlue"
                    fontSize="xl"
                    my={0}
                    pt={3}
                  >
                    Push Notifications
                  </Heading>
                  <Text fontSize="sm">
                    Push Notifications send notifications to your device.
                  </Text>
                  <PushNotificationForm user={user} />
                </Grid>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </SkeletonLoaderWrapper>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: await getBasePageProps(),
  };
};

export default Info;

Info.auth = {
  skeleton: <Box />,
};
