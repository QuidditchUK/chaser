import { useState, forwardRef } from 'react';
import dynamic from 'next/dynamic';
import { StyledLink } from 'components/latest-news';
import useSWR from 'swr';
import Link from 'next/link';
import { api } from 'modules/api';
import { parseCookies } from 'modules/cookies';
import { Box, Grid, Flex, ListItem, Text, OrderedList } from '@chakra-ui/react';

const Meta = dynamic(() => import('components/meta'));
const Container = dynamic(() => import('components/container'));
const Heading = dynamic(() => import('components/heading'));
const Content = dynamic(() => import('components/content'));
const Image = dynamic(() => import('components/image'));
const ProductCard = dynamic(() => import('components/product-card'));
const ClubCard = dynamic(() => import('components/club-card'));

const Checkmark = (props) => (
  <Box
    ml={3}
    h="25px"
    w="25px"
    borderRadius="full"
    bg="keeperGreen"
    _after={{
      content: '',
      display: 'block',
      position: 'relative',
      left: '10px',
      top: '7px',
      width: '5px',
      height: '10px',
      borderStyle: 'solid',
      borderWidth: '0 3px 3px 0',
      transform: 'rotate(45deg)',
    }}
    {...props}
  />
);

const StyledAnchor = forwardRef(function StyledAnchor(props, ref) {
  return <Box textDecoration="none" ref={ref} {...props} />;
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
  const { data: memberships } = useSWR('/products/me', api);
  const { data: rawClub } = useSWR(
    () => (user.club_uuid ? `/clubs/${user.club_uuid}` : null),
    api
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
          <Heading as="h1" fontFamily="body" color="qukBlue" mt={0}>
            Hello, {user.first_name} 👋
          </Heading>
          <Box bg="qukBlue" borderRadius={1}>
            <Grid
              gridTemplateColumns={{
                base: '1fr',
                md: '1fr 1fr',
                lg: '2fr 1fr',
              }}
              gridGap={{ base: 4, md: 9 }}
              color="white"
              borderRadius={1}
              overflow="hidden"
            >
              <Flex
                direction="column"
                justifyContent="center"
                px={{ base: 6, md: 8 }}
                py={4}
              >
                <Heading as="h2" fontFamily="body" mt={0}>
                  Get ready for brooms up
                </Heading>
                <Content fontSize="1">
                  As the new season approaches, complete the following list to
                  be ready when the season kicks off:
                </Content>

                <OrderedList p={0} pl={4}>
                  <ListItem
                    mb={2}
                    color={setupProfile ? 'keeperGreen' : 'white'}
                  >
                    <Flex alignItems="center">
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

                      {setupProfile && <Checkmark />}
                    </Flex>
                  </ListItem>

                  <ListItem mb={2} color={membership ? 'keeperGreen' : 'white'}>
                    <Flex alignItems="center">
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

                      {membership && <Checkmark />}
                    </Flex>
                  </ListItem>

                  <ListItem mb={2} color={club ? 'keeperGreen' : 'white'}>
                    <Flex alignItems="center">
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

                      {!!club && <Checkmark />}
                    </Flex>
                  </ListItem>
                </OrderedList>
              </Flex>

              <Box
                position="relative"
                backgroundImage={
                  'url("https://images.prismic.io/chaser/b97e3eab-dcb7-4474-85e0-914afe58ae74_IMG_0529.JPG?auto=compress,format")'
                }
                backgroundColor="qukBlue"
                backgroundSize="cover"
                backgroundPosition="center"
                height="100%"
                width="100%"
                minHeight="300px"
              />
            </Grid>
          </Box>

          <Grid
            gridTemplateColumns={{ base: '1fr', md: '2fr 1fr' }}
            gridGap={{ base: 4, sm: 8, md: 9 }}
          >
            {membership && (
              <Flex flexDirection="column">
                <Heading as="h2" fontFamily="body" color="qukBlue">
                  My membership
                </Heading>

                <ProductCard
                  key={membership?.id}
                  id={membership?.id}
                  image={membership?.images ? membership.images[0] : null}
                  description={membership?.description}
                  name={membership?.name}
                  expires={membership?.metadata?.expires}
                />
              </Flex>
            )}

            {club && (
              <Flex flexDirection="column">
                <Heading as="h2" fontFamily="body" color="qukBlue">
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
                            src={club.images[0]}
                            alt={club.name}
                            width={1600}
                            height={900}
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
