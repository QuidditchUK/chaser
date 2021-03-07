import { useState } from 'react';
import dynamic from 'next/dynamic';
import styled from '@emotion/styled';
import useSWR from 'swr';
import Link from 'next/link';
import { color, border } from 'styled-system';
import { api } from 'modules/api';
import { parseCookies } from 'modules/cookies';
import { Box, Grid, Flex } from 'components';
import { CenterJustify } from 'components/image-and-content';

const Meta = dynamic(() => import('components/meta'));
const Container = dynamic(() => import('components/container'));
const Heading = dynamic(() => import('components/heading'));
const Content = dynamic(() => import('components/content'));
const Image = dynamic(() => import('components/image'));
const ProductCard = dynamic(() => import('components/product-card'));
const ClubCard = dynamic(() => import('components/club-card'));

const StyledLink = styled.a`
  text-decoration: none;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const ListItem = styled.li`
  ${color};
  margin-bottom: ${({ theme }) => theme.space[2]};
`;

const Checkmark = styled.span`
  margin-left: ${({ theme }) => theme.space[3]};
  height: 25px;
  width: 25px;
  border-radius: 50%;
  display: inline-block;
  background-color: ${({ theme }) => theme.colors.keeperGreen};

  &:after {
    content: '';
    display: block;
    position: relative;
    left: 10px;
    top: 7px;
    width: 5px;
    height: 10px;
    border: solid ${({ theme }) => theme.colors.white};
    border-width: 0 3px 3px 0;
    transform: rotate(45deg);
  }
`;

const StyledAnchor = styled.a`
  text-decoration: none;
`;

const Span = styled.span`
  border-bottom: 2px solid ${({ theme }) => theme.colors.black};
  ${color};
  ${border};
  line-height: 1.5rem;
`;

const StyledList = styled.ol`
  padding: 0;
  padding-left: 1rem;
`;

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
              <CenterJustify px={{ base: 6, md: 8 }} py={4}>
                <Heading as="h2" fontFamily="body" mt={0}>
                  Get ready for brooms up
                </Heading>
                <Content fontSize="1">
                  As the new season approaches, complete the following list to
                  be ready when the season kicks off:
                </Content>

                <StyledList>
                  <ListItem color={setupProfile ? 'keeperGreen' : 'white'}>
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

                  <ListItem color={membership ? 'keeperGreen' : 'white'}>
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

                  <ListItem color={club ? 'keeperGreen' : 'white'}>
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
                </StyledList>
              </CenterJustify>

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
