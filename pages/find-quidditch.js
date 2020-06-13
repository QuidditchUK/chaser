import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Router, { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Formik,
  Form,
  Field,
  useFormikContext,
} from 'formik';
import { api } from 'modules/api';
import styled from 'styled-components';
import { space } from 'styled-system';
import debounce from 'just-debounce';
import Layout from 'containers/layout';
import { Box, Flex, Grid } from 'components/layout';
import { HeadingHero } from 'components/hero';
import Container from 'components/container';
import Heading from 'components/heading';
import ClubCard from 'components/club-card';
import EventCard from 'components/event-card';
import Image from 'components/image';
import Meta from 'components/meta';
import { BLOG_MIN_HEIGHTS } from 'styles/hero-heights';

const MOCK_CLUBS = [{
  uuid: '789e0d73-af14-4a35-a37f-8c854728dsd9b9',
  name: 'London Quidditch Club',
  slug: 'london-quidditch-club',
  league: 'Community',
  location: { type: 'POINT', coordinates: ['-0.150805', '51.460149'] },
  images: ['https://images.prismic.io/chaser/40bfbdca-e2e0-4273-85fd-3aaca8dfb09c_57246916_1980968082025155_3749381092197531648_o.jpg?auto=compress,format'],
  venue: 'Clapham Common, London',
  featured_color: '#062461',
  text_color: '#ffffff',
  icon: 'https://images.prismic.io/chaser/568da066-5b90-4ca8-ac8f-8dcbfc3fd610_lqc.png?auto=compress,format',
},
{
  uuid: '789e0d73-af14-4a35-a37f-8c854728c9b9',
  name: 'London Unspeakables Quidditch',
  slug: 'london-unspeakables-quidditch',
  league: 'Community',
  location: { type: 'POINT', coordinates: ['-0.148176', '51.453825'] },
  images: ['https://images.prismic.io/chaser/475578b7-a77c-4abc-90f2-de1547bbacf2_72886220_1438371239645635_5936997713475272704_o.jpg?auto=compress,format'],
  venue: 'Clapham Common, London',
  featured_color: '#381e51',
  text_color: '#ffffff',
  icon: 'https://images.prismic.io/chaser/98cc10fb-4840-40ac-a973-1bc54e7d86c5_unspeakables.png?auto=compress,format',
},
{
  uuid: '2d31f5d3-c265-4e5a-a973-5b77ab3218df',
  name: 'Werewolves of London Quidditch Club',
  slug: 'werewolves-of-london',
  league: 'Community',
  location: { type: 'POINT', coordinates: ['-0.157671', '51.558175'] },
  images: ['https://images.prismic.io/chaser/71dc92d4-5687-4814-933a-9fb1b92093dc_60423142_2303196516632278_4906127668908392448_n.jpg?auto=compress,format'],
  venue: 'Hampstead Heath, London',
  featured_color: '#6a1713',
  text_color: '#ffffff',
  icon: 'https://images.prismic.io/chaser/38824ffa-4c30-4a01-960a-42a236bee0cc_werewolves.jpg?auto=compress,format',
},
{
  uuid: '36f03565-f622-43e6-90c5-fae022c5444c',
  name: 'St Andrews Snidgets Quidditch Club',
  slug: 'st-andrews-snidgets',
  league: 'University',
  location: { type: 'POINT', coordinates: ['-2.811808', '56.341305'] },
  images: ['https://images.prismic.io/chaser/879d8b2b-428d-4130-acba-509bc327e8f1_31265313_2077158405647076_3498501473933721600_o.jpg?auto=compress,format'],
  venue: 'North Haugh, St Andrews',
  featured_color: '#1f4183',
  text_color: '#ffffff',
  icon: 'https://images.prismic.io/chaser/86004abc-75c2-4990-b519-8ea86a0e951b_snidgets.png?auto=compress,format',
}];

const MOCK_EVENTS = [{
  uuid: '36f03565-f622-43e6-90c5-fae022c5444z',
  name: 'Northern Cup 2020',
  league: 'University',
  slug: 'northern-cup-2020',
  location: { type: 'POINT', coordinates: ['-2.811808', '56.341305'] },
  venue: 'Sheffield Hallam University Sports Park',
  postcode: 'S9 1UA',
  start_time: '2020-11-13 07:00:00Z',
  images: ['https://images.prismic.io/chaser/239db290-616f-4839-8d5f-3fa0ea83ab4d_DSC04508-2000x1200.jpg?auto=compress,format'],
  icon: 'https://images.prismic.io/chaser/65d65868-3e13-4024-871a-6f23d1467042_Northern-Cup-2019-Logo.png?auto=compress,format',
  registerLink: 'https://docs.google.com/forms/d/e/1FAIpQLSdqKtdD2MoUfobYHtlzIbItUeOsgjJgWmylPnnP4vrkOCgpUg/viewform',
  registerTime: '2020-05-13 07:00:00Z',
},
{
  uuid: '36f03565-f622-43e6-90c5-fae022c5444y',
  name: 'Southern Cup 2020',
  league: 'University',
  slug: 'southern-cup-2020',
  location: { type: 'POINT', coordinates: ['-2.811808', '56.341305'] },
  venue: 'Oxford Brookes Sports Park',
  postcode: 'S9 1UA',
  start_time: '2020-11-29 07:00:00Z',
  images: ['https://images.prismic.io/chaser/ed7c8345-27c6-4517-8a60-954d641ad8b1_QD_FN-128+copy.jpg?auto=compress,format'],
  icon: 'https://images.prismic.io/chaser/1a2c9d38-6c51-44af-8cd3-57a24b04d452_Southern-Cup-6-Tournament-Logo.png?auto=compress,format',
  registerLink: 'https://docs.google.com/forms/d/e/1FAIpQLSdqKtdD2MoUfobYHtlzIbItUeOsgjJgWmylPnnP4vrkOCgpUg/viewform',
  registerTime: '2020-09-13 07:00:00Z',
},
{
  uuid: '36f03565-f622-43e6-90c5-fae022c5444x',
  name: 'Community Fixture #1',
  league: 'Community',
  slug: 'community-fixture-1-2020',
  location: { type: 'POINT', coordinates: ['-2.811808', '56.341305'] },
  venue: 'Clapham Common',
  postcode: 'SW4 0NH',
  start_time: '2020-12-25 07:00:00Z',
  images: ['https://images.prismic.io/chaser/d03c57e4-c3f3-4033-b08f-d0331d860ec4_57114819_3035649453142627_7886437477404114944_o.jpg?auto=compress,format'],
  icon: 'https://images.prismic.io/chaser/1a2c9d38-6c51-44af-8cd3-57a24b04d452_Southern-Cup-6-Tournament-Logo.png?auto=compress,format',
  registerLink: 'https://docs.google.com/forms/d/e/1FAIpQLSdqKtdD2MoUfobYHtlzIbItUeOsgjJgWmylPnnP4vrkOCgpUg/viewform',
  registerTime: '2020-09-13 07:00:00Z',
},
];

const Input = styled.input`
  background: transparent;
  border: 0;
  border-bottom: 3px solid ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.white};
  outline: 0;
  ${space};

  &::placeholder {
    color: ${({ theme }) => theme.colors.white};
    opacity: 0.8;
  }
`;

const StyledLink = styled.a`
  text-decoration: none;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const fetchResults = (postcode) => console.log(postcode);
const fetchDebouncedResults = debounce(fetchResults, 1000);

const updatePostcode = (postcode) => {
  Router.push({
    pathname: Router.pathname,
    query: { postcode },
  }, {
    pathname: Router.pathname,
    query: { postcode },
  }, { shallow: true });

  fetchDebouncedResults(postcode);
};

const AutoValidatePostcode = () => {
  const { values } = useFormikContext();

  useEffect(() => {
    updatePostcode(values.postcode);
  }, [values.postcode]);

  return null;
};

const FindQuidditch = ({ clubs, events }) => {
  const { query: { postcode = '' } } = useRouter();
  const [showClubs, setShowClubs] = useState(true);
  const [showEvents, setShowEvents] = useState(true);

  return (
    <Layout>
      <Meta subTitle="Find Quidditch near you" description="Find your nearest clubs and upcoming Quidditch events in the UK" image="https://images.prismic.io/chaser/187adf69-c199-4a01-82db-179bf9ed72c5_ET2_0158.jpg?auto=compress,format&rect=0,0,3360,1959&w=3360&h=1959" />
      <Box
        as="section"
        position="relative"
        backgroundImage="url(https://images.prismic.io/chaser/187adf69-c199-4a01-82db-179bf9ed72c5_ET2_0158.jpg?auto=compress,format&rect=0,0,3360,1959&w=3360&h=1959)"
        backgroundColor="primary"
        backgroundSize="cover"
        backgroundPosition="center"
        minHeight={BLOG_MIN_HEIGHTS}
      >
        <Flex
          position="absolute"
          minHeight={BLOG_MIN_HEIGHTS}
          zIndex={1}
          bg="primary"
          opacity={0.2}
          width="100%"
        />

        <Flex
          position="relative"
          minHeight={BLOG_MIN_HEIGHTS}
          alignItems="center"
          zIndex={2}
        >
          <Container px={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}>
            <Formik
              initialValues={{ postcode }}
            >
              <Form>
                <HeadingHero fontSize={[4, 4, 6]} color="white" isBody>
                  Quidditch near
                  <Field
                    name="postcode"
                    placeholder="Postcode"
                    as={Input}
                    size="8"
                    marginLeft={[2, 4]}
                  />
                  <AutoValidatePostcode />
                </HeadingHero>
              </Form>
            </Formik>
          </Container>
        </Flex>
      </Box>
      <Box bg="white" py={5}>
        <Container px={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}>
          <input type="checkbox" checked={showClubs} onChange={() => setShowClubs(!showClubs)} /> Clubs
          <input type="checkbox" checked={showEvents} onChange={() => setShowEvents(!showEvents)} /> Events
        </Container>
      </Box>

      <Box
        bg="greyLight"
        py={{ _: 6, l: 10 }}
      >
        <Container px={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}>
          {showClubs
          && (
          <>
            <Heading as="h2" fontSize={4} mt={0} isBody color="primary">Clubs</Heading>

            <Grid
              gridTemplateColumns={{ _: '1fr', m: '1fr 1fr' }}
              gridGap={{ _: 'gutter._', m: 'gutter.m' }}
              pb={3}
            >
              {clubs.map((club) => (
                <Flex flexDirection="column" key={club.uuid}>
                  <Link href="/clubs/[club]" as={`/clubs/${club.slug}`} passHref>
                    <StyledLink>
                      <ClubCard
                        backgroundColor={club.featured_color}
                        color={club.text_color}
                        name={club.name}
                        league={club.league}
                        venue={club.venue}
                        icon={club.icon}
                        image={club.images ? (
                          <Image
                            src={club.images[0]}
                            alt={club.name}
                            width={1600}
                            height={900}
                          />
                        ) : null}
                      />
                    </StyledLink>
                  </Link>
                </Flex>
              ))}
            </Grid>
          </>
          )}

          {showEvents
          && (
            <>
              <Heading as="h2" fontSize={4} isBody color="primary">Events</Heading>

              <Grid
                gridTemplateColumns="1fr"
                gridGap={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}
              >
                {events.map((event) => (
                  <Flex flexDirection="column" key={event.uuid}>
                    <EventCard
                      name={event.name}
                      type={event.type}
                      icon={event.icon}
                      league={event.league}
                      venue={event.venue}
                      startTime={event.start_time}
                      image={event.images[0]}
                      slug={event.slug}
                      registerLink={event.registerLink}
                      registerTime={event.registerTime}
                    />
                  </Flex>
                ))}
              </Grid>
            </>
          )}
        </Container>
      </Box>
    </Layout>
  );
};

FindQuidditch.defaultProps = {
  clubs: MOCK_CLUBS,
  events: [],
};

FindQuidditch.propTypes = {
  clubs: PropTypes.arrayOf(PropTypes.shape({})),
  events: PropTypes.arrayOf(PropTypes.shape({})),
};

export const getServerSideProps = async ({ query }) => {
  const { postcode } = query;

  if (!postcode) {
    const { data: clubs } = await api.get('/clubs/search');
    return {
      props: { clubs, events: MOCK_EVENTS },
    };
  }

  const { data: clubs } = await api.get(`/clubs/search?postcode=${postcode}`);

  return {
    props: { clubs, events: MOCK_EVENTS },
  };
};

FindQuidditch.propTypes = {};

export default FindQuidditch;
