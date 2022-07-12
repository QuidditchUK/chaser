import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Box, Grid, Flex, Heading, Link as ChakraLink } from '@chakra-ui/react';
import isAuthorized from 'modules/auth';
import { getBasePageProps } from 'modules/prismic';
import generateServerSideHeaders from 'modules/headers';
import useCachedResponse from 'hooks/useCachedResponse';

import usersService from 'services/users';
import productsService from 'services/products';
import clubsService from 'services/clubs';

import Slice from 'components/shared/slice';
import { PlusSquareIcon, ChevronRightIcon } from '@chakra-ui/icons';
import GroupIcon from 'public/images/group.svg';

const Meta = dynamic(() => import('components/shared/meta'));
const ProductCard = dynamic(() => import('components/dashboard/product-card'));
const PrismicClubCard = dynamic(() => import('components/prismic/club-card'));

const Dashboard = ({ user }) => {
  const { data: memberships } = useCachedResponse({
    queryKey: '/products/me',
    queryFn: productsService.getUserProducts,
  });

  const { data: club } = useCachedResponse({
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
      <Slice>
        <Heading
          as="h1"
          fontFamily="body"
          color="qukBlue"
          mt={0}
          fontSize="3xl"
        >
          Hello, {user.first_name} 👋
        </Heading>

        <Grid
          gridTemplateColumns={{ base: '1fr', md: '2fr 1fr' }}
          gridGap={{ base: 4, sm: 8, md: 9 }}
          minHeight="300px"
        >
          <Flex flexDirection="column">
            <Heading as="h2" fontFamily="body" color="qukBlue" fontSize="2xl">
              My membership
            </Heading>
            {membership ? (
              <ProductCard
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
                      Purchase your Quidditch UK Membership <ChevronRightIcon />
                    </Flex>
                  </Flex>
                </ChakraLink>
              </Link>
            )}
          </Flex>

          <Flex flexDirection="column">
            <Heading as="h2" fontFamily="body" color="qukBlue" fontSize="2xl">
              My club
            </Heading>
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
        </Grid>
      </Slice>
    </>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  if (!isAuthorized(req, res)) {
    return { props: {} };
  }

  const headers = generateServerSideHeaders(req);

  const { data: user } = await usersService.getUser({ headers });
  const basePageProps = await getBasePageProps();

  return {
    props: {
      user,
      ...basePageProps,
    },
  };
};

export default Dashboard;
