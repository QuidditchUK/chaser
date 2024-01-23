import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  Box,
  Flex,
  Heading,
  Link as ChakraLink,
  Skeleton,
  Grid,
  useToast,
  Text
} from '@chakra-ui/react';

import { getBasePageProps } from 'modules/prismic';

import useCachedResponse from 'hooks/useCachedResponse';

import productsService from 'services/products';
import clubsService from 'services/clubs';

import { PlusSquareIcon, ChevronRightIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import GroupIcon from 'public/images/group.svg';
import { ProductCardV2 } from 'components/dashboard/product-card';
import { InfoCard } from 'components/dashboard/info-card';
import { clubs as Club } from '@prisma/client';
import Stripe from 'stripe';
import useMe from 'hooks/useMe';
import SkeletonLoaderWrapper from 'components/shared/SkeletonLoaderWrapper';
import { getPlainScopes } from 'modules/scopes';
import { BANNED } from 'constants/scopes';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Container = dynamic(() => import('components/layout/container'));

const HorizontalScrollWrapper = dynamic(
  () => import('components/shared/horizontal-scroll-wrapper')
);

const Meta = dynamic(() => import('components/shared/meta'));
const PrismicClubCard = dynamic(() => import('components/prismic/club-card'));

const Dashboard = () => {
  const { data: user, isLoading } = useMe();
  const { push } = useRouter();

  const userScopes = getPlainScopes(user?.scopes);
  const toast = useToast();

  useEffect(() => {
    const handleSignOut = async () => {
    const data = await signOut({ redirect: false, callbackUrl: '/' });
    toast({
      title: 'Account banned',
      description:
        'Your account has been banned. If you think this is a mistake, please contact us via https://quadballuk.org/about/contact-us',
      status: 'error',
      duration: 5000,
      position: 'top',
      variant: 'left-accent',
      isClosable: true,
    });
    push(data?.url);
  };
    if (userScopes && userScopes.includes(BANNED)) {
      handleSignOut();
    }
  }, [userScopes, push, toast]);

  const { data: memberships } = useCachedResponse<Stripe.Product[]>({
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
        description="Sign in to QuadballUK to manage your QuadballUK Membership, Account details and more"
        subTitle="Dashboard"
      />
      <SkeletonLoaderWrapper
        isLoading={isLoading}
        loaderComponent={DashboardSkeleton}
      >
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
              Hello, {user?.first_name} 👋
            </Heading>

            <Box width="100%" bg="gray.50" border="1px solid" borderColor="qukBlue" p={4} my={3} borderRadius="md">
              <Heading fontFamily="body" color='qukBlue' fontSize="xl" mt={0}>Mouthguard Discount</Heading>
              <Text>From October 3rd until February 29th, All QuadballUK members are eligible for a 20% discount with free shipping on orders with SISU Mouthguards! Simply enter the code <strong>QuadballUK24</strong> at checkout to receive your discount. <ChakraLink href="https://sisuguard.eu/" target="_blank" rel="noopener noreferrer">SISU Website <ExternalLinkIcon /></ChakraLink></Text>
            </Box>

            <HorizontalScrollWrapper horizontalScroll itemsCount={3}>
              <Flex flexDirection="column">
                <Heading
                  as="h2"
                  fontFamily="body"
                  color="qukBlue"
                  fontSize="2xl"
                >
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
                          Purchase your QuadballUK Membership{' '}
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
                <Heading
                  as="h2"
                  fontFamily="body"
                  color="qukBlue"
                  fontSize="2xl"
                >
                  Player Profile
                </Heading>

                <InfoCard user={user} club={club} />
              </Flex>
            </HorizontalScrollWrapper>
          </Container>
        </Box>
      </SkeletonLoaderWrapper>
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
