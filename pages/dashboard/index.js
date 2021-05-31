import { useState, forwardRef } from 'react';
import dynamic from 'next/dynamic';
import { useQuery } from 'react-query';
import Link from 'next/link';
import { api } from 'modules/api';
import { parseCookies } from 'modules/cookies';
import {
  Box,
  Grid,
  Flex,
  ListItem,
  Text,
  OrderedList,
  Heading,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';

const StyledLink = dynamic(() =>
  import('components/latest-news').then(({ StyledLink }) => StyledLink)
);
const Meta = dynamic(() => import('components/meta'));
const Container = dynamic(() => import('components/container'));

const Content = dynamic(() => import('components/content'));
const Image = dynamic(() => import('components/image'));
const ProductCard = dynamic(() => import('components/product-card'));
const ClubCard = dynamic(() => import('components/club-card'));

const StyledAnchor = forwardRef(function StyledAnchor(props, ref) {
  return (
    <ChakraLink
      textDecoration="none"
      cursor="pointer"
      _hover={{ textDecoration: 'none' }}
      ref={ref}
      {...props}
    />
  );
});

const Span = (props) => (
  <Text
    as="span"
    borderBottom="2px solid black"
    lineHeight="1.5rem"
    {...props}
  />
);

const Dashboard = ({ user }) => {
  const [setupProfile] = useState(user.is_student !== null);
  const { data: memberships } = useQuery(['/products/me'], () =>
    api.get('/products/me')
  );
  const { data: rawClub } = useQuery(
    ['/clubs/', user.club_uuid],
    () => api.get(`/clubs/${user.club_uuid}`),
    { enabled: Boolean(user?.club_uuid) }
  );

  const [membership] = memberships?.data || [];
  const club = rawClub?.data || null;

  return (
    <>
      <Meta
        description="Sign in to QuidditchUK to manage your QuidditchUK Membership, Account details and more"
        subTitle="Dashboard"
      />
      <Box
        bg="greyLight"
        py={{ base: 4, lg: 10 }}
        px={{ base: 4, sm: 8, md: 9 }}
      >
        <Container>
          <Heading
            as="h1"
            fontFamily="body"
            color="qukBlue"
            mt={0}
            fontSize="3xl"
          >
            Hello, {user.first_name} 👋
          </Heading>

          <Box bg="qukBlue" borderRadius="md">
            <Grid
              gridTemplateColumns={{
                base: '1fr',
                md: '1fr 1fr',
                lg: '2fr 1fr',
              }}
              gridGap={{ base: 4, md: 9 }}
              color="white"
              borderRadius="md"
              overflow="hidden"
            >
              <Flex
                direction="column"
                justifyContent="center"
                px={{ base: 6, md: 8 }}
                py={4}
              >
                <Heading as="h2" fontFamily="body" mt={0} fontSize="2xl">
                  Get ready for brooms up
                </Heading>
                <Content fontSize="md">
                  As the new season approaches, complete the following list to
                  be ready when the season kicks off:
                </Content>

                <OrderedList p={0}>
                  <ListItem
                    mb={2}
                    color={setupProfile ? 'keeperGreen' : 'white'}
                  >
                    <Flex
                      alignItems="center"
                      ml={4}
                      justifyContent="flex-start"
                    >
                      <Link href="/dashboard/account/info" passHref>
                        <StyledAnchor>
                          <Span
                            color={setupProfile ? 'keeperGreen' : 'white'}
                            borderColor={setupProfile ? 'keeperGreen' : 'white'}
                          >
                            Add your user information
                          </Span>
                        </StyledAnchor>
                      </Link>

                      {setupProfile && (
                        <CheckCircleIcon ml={2} color="keeperGreen" />
                      )}
                    </Flex>
                  </ListItem>

                  <ListItem mb={2} color={membership ? 'keeperGreen' : 'white'}>
                    <Flex alignItems="center" ml={4}>
                      <Link href="/dashboard/membership/manage" passHref>
                        <StyledAnchor>
                          <Span
                            color={membership ? 'keeperGreen' : 'white'}
                            borderColor={membership ? 'keeperGreen' : 'white'}
                          >
                            Purchase your QuidditchUK Membership
                          </Span>
                        </StyledAnchor>
                      </Link>

                      {membership && (
                        <CheckCircleIcon ml={2} color="keeperGreen" />
                      )}
                    </Flex>
                  </ListItem>

                  <ListItem mb={2} color={club ? 'keeperGreen' : 'white'}>
                    <Flex alignItems="center" ml={4}>
                      <Link href="/dashboard/membership/club" passHref>
                        <StyledAnchor>
                          <Span
                            color={club ? 'keeperGreen' : 'white'}
                            borderColor={club ? 'keeperGreen' : 'white'}
                          >
                            Select your club
                          </Span>
                        </StyledAnchor>
                      </Link>

                      {!!club && <CheckCircleIcon ml={2} color="keeperGreen" />}
                    </Flex>
                  </ListItem>
                </OrderedList>
              </Flex>

              <Box
                position="relative"
                minHeight="300px"
                height="100%"
                width="100%"
              >
                <Image
                  layout="fill"
                  alt="London Unbreakables line up at the keeper line before the start of a Quidditch match"
                  src="https://images.prismic.io/chaser/b97e3eab-dcb7-4474-85e0-914afe58ae74_IMG_0529.JPG?auto=compress,format"
                  borderRadius="0"
                  clipPath={{
                    base: 'none',
                    lg: 'polygon(10% 0, 100% 0, 100% 100%, 0 100%)',
                  }}
                />
              </Box>
            </Grid>
          </Box>

          <Grid
            gridTemplateColumns={{ base: '1fr', md: '2fr 1fr' }}
            gridGap={{ base: 4, sm: 8, md: 9 }}
          >
            {membership && (
              <Flex flexDirection="column">
                <Heading
                  as="h2"
                  fontFamily="body"
                  color="qukBlue"
                  fontSize="2xl"
                >
                  My membership
                </Heading>

                <ProductCard
                  key={membership?.id}
                  id={membership?.id}
                  image={membership?.images ? membership?.images?.[0] : null}
                  description={membership?.description}
                  name={membership?.name}
                  expires={membership?.metadata?.expires}
                />
              </Flex>
            )}

            {club && (
              <Flex flexDirection="column">
                <Heading
                  as="h2"
                  fontFamily="body"
                  color="qukBlue"
                  fontSize="2xl"
                >
                  My club
                </Heading>

                <Link href="/clubs/[club]" as={`/clubs/${club.slug}`} passHref>
                  <StyledLink>
                    <ClubCard
                      backgroundColor={club.featured_color}
                      color={club.text_color}
                      name={club.name}
                      league={club.league}
                      venue={club.venue}
                      status={club.status}
                      icon={club.icon}
                      image={
                        club.images ? (
                          <Image
                            src={club?.images?.[0]}
                            alt={club?.name}
                            layout="responsive"
                            width={640}
                            height={360}
                            borderRadius="0px"
                          />
                        ) : null
                      }
                    />
                  </StyledLink>
                </Link>
              </Flex>
            )}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  const { AUTHENTICATION_TOKEN } = parseCookies(req);

  if (!AUTHENTICATION_TOKEN) {
    res.setHeader('location', '/login');
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }

  const { data: user } = await api.get('/users/me', {
    headers: {
      Authorization: `Bearer ${AUTHENTICATION_TOKEN}`,
    },
  });

  return {
    props: {
      user,
    },
  };
};

export default Dashboard;
