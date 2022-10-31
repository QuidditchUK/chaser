import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  Box,
  Flex,
  Heading,
  Link as ChakraLink,
  Skeleton,
  Grid,
} from '@chakra-ui/react';

import { getBasePageProps } from 'modules/prismic';

import useCachedResponse from 'hooks/useCachedResponse';

import productsService from 'services/products';
import clubsService from 'services/clubs';

import { PlusSquareIcon, ChevronRightIcon } from '@chakra-ui/icons';
import GroupIcon from 'public/images/group.svg';
import { ProductCardV2 } from 'components/dashboard/product-card';
import { InfoCard } from 'components/dashboard/info-card';
import { useSession } from 'next-auth/react';
import { clubs as Club } from '@prisma/client';

const Container = dynamic(() => import('components/layout/container'));

const HorizontalScrollWrapper = dynamic(
  () => import('components/shared/horizontal-scroll-wrapper')
);

const Meta = dynamic(() => import('components/shared/meta'));
const PrismicClubCard = dynamic(() => import('components/prismic/club-card'));

const Dashboard = () => {
  const { data: session } = useSession();

  const { user } = session;

  const { data: memberships } = useCachedResponse<any>({
    queryKey: '/products/me',
    queryFn: productsService.getUserProducts,
  });

  const { data: club } = useCachedResponse<Club>({
    queryKey: ['/clubs', user?.club_uuid],
    queryFn: () => clubsService.getClub({ club_uuid: user?.club_uuid }),
    enabled: Boolean(user?.club_uuid),
  });

  const [membership] = memberships || [];

  return (
    <>
      <Meta
        description="Sign in to QuidditchUK to manage your QuidditchUK Membership, Account details and more"
        subTitle="Dashboard"
      />
      <Box
        bg="greyLight"
        py={{ base: 6, lg: 10 }}
        px={{ base: 0, md: 9 }}
        sx={{
          '& a': {
            fontWeight: 'bold',
            textDecoration: 'none',
            color: 'monarchRed',

            _hover: {
              textDecoration: 'none',
              color: 'monarchRed',
            },
          },
        }}
      >
        <Container>
          <Heading
            as="h1"
            fontFamily="body"
            color="qukBlue"
            mt={0}
            px={{ base: 8, md: 0 }}
            fontSize="3xl"
          >
            Hello, {user.first_name} 👋
          </Heading>

          <HorizontalScrollWrapper horizontalScroll itemsCount={3}>
            <Flex flexDirection="column">
              <Heading as="h2" fontFamily="body" color="qukBlue" fontSize="2xl">
                Membership
              </Heading>

              {membership ? (
                <ProductCardV2
                  key={membership?.id}
                  id={membership?.id}
                  image={membership?.images ? membership?.images?.[0] : null}
                  description={membership?.description}
                  name={membership?.name}
                  expires={membership?.metadata?.expires}
                />
              ) : (
                <Link href="/dashboard/membership/manage" passHref>
                  <ChakraLink height="100%">
                    <Flex
                      direction="column"
                      borderRadius="lg"
                      bg="gray.300"
                      height="100%"
                      alignItems="center"
                      justifyContent="center"
                      p={4}
                    >
                      <PlusSquareIcon w={100} h={100} color="gray.400" />
                      <Flex alignItems="center" color="gray.600">
                        Purchase your Quidditch UK Membership{' '}
                        <ChevronRightIcon />
                      </Flex>
                    </Flex>
                  </ChakraLink>
                </Link>
              )}
            </Flex>

            <Flex flexDirection="column">
              <Flex
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Heading
                  as="h2"
                  fontFamily="body"
                  color="qukBlue"
                  fontSize="2xl"
                >
                  Club
                </Heading>
                {club && (
                  <Link href="/dashboard/membership/club" passHref>
                    <ChakraLink>
                      Manage <ChevronRightIcon />
                    </ChakraLink>
                  </Link>
                )}
              </Flex>
              {club ? (
                <PrismicClubCard uid={club?.slug} />
              ) : (
                <Link href="/dashboard/membership/club" passHref>
                  <ChakraLink height="100%">
                    <Flex
                      direction="column"
                      borderRadius="lg"
                      bg="gray.300"
                      height="100%"
                      alignItems="center"
                      justifyContent="center"
                      p={4}
                    >
                      <Box as={GroupIcon} w={100} h={100} color="gray.400" />
                      <Flex alignItems="center" color="gray.600">
                        Select your club <ChevronRightIcon />
                      </Flex>
                    </Flex>
                  </ChakraLink>
                </Link>
              )}
            </Flex>
            <Flex flexDirection="column" alignContent="flex-end">
              <Heading as="h2" fontFamily="body" color="qukBlue" fontSize="2xl">
                Player Profile
              </Heading>

              <InfoCard user={user} club={club} />
            </Flex>
          </HorizontalScrollWrapper>
        </Container>
      </Box>
    </>
  );
};

const DashboardSkeleton = () => (
  <Box py={{ base: 6, lg: 10 }}>
    <Container>
      <Skeleton>
        <Heading
          as="h1"
          fontFamily="body"
          color="qukBlue"
          mt={0}
          px={{ base: 8, md: 0 }}
          fontSize="3xl"
        >
          Hello
        </Heading>
      </Skeleton>

      <Grid
        gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))"
        gridGap={{ base: 4, md: 9 }}
        px={{ base: 4, sm: 8, md: 0 }}
      >
        <Skeleton height="300px" />
        <Skeleton height="300px" />
        <Skeleton height="300px" />
      </Grid>
    </Container>
  </Box>
);

export const getServerSideProps = async () => {
  const basePageProps = await getBasePageProps();

  return { props: basePageProps };
};

export default Dashboard;

Dashboard.auth = {
  skeleton: <DashboardSkeleton />,
};
