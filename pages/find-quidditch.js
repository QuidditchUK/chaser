/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
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
import { debounce } from 'throttle-debounce';
import Layout from 'containers/layout';
import { Box, Flex, Grid } from 'components/layout';
import { HeadingHero } from 'components/hero';
import Container from 'components/container';
import Heading from 'components/heading';
import ClubCard from 'components/club-card';
import EventCard from 'components/event-card';
import Image from 'components/image';
import Meta from 'components/meta';
import Button from 'components/button';
import { BLOG_MIN_HEIGHTS } from 'styles/hero-heights';
import { postcodeRegex } from 'modules/validations';
import CloseIcon from 'public/images/close.svg';

const Icon = styled.div`
  ${space};
  display: inline-block;
  width: 30px;

  svg {
    height: 30px;
    width: 30px;
    filter: drop-shadow(0 0 .2rem rgb(0, 0, 0));
  }
`;

// const MOCK_EVENTS = [{
//   uuid: '36f03565-f622-43e6-90c5-fae022c5444z',
//   name: 'Northern Cup 2020',
//   league: 'University',
//   slug: 'northern-cup-2020',
//   location: { type: 'POINT', coordinates: ['-2.811808', '56.341305'] },
//   venue: 'Sheffield Hallam University Sports Park',
//   postcode: 'S9 1UA',
//   start_time: '2020-11-13 07:00:00Z',
//   images: ['https://images.prismic.io/chaser/239db290-616f-4839-8d5f-3fa0ea83ab4d_DSC04508-2000x1200.jpg?auto=compress,format'],
//   icon: 'https://images.prismic.io/chaser/65d65868-3e13-4024-871a-6f23d1467042_Northern-Cup-2019-Logo.png?auto=compress,format',
//   registerLink: 'https://docs.google.com/forms/d/e/1FAIpQLSdqKtdD2MoUfobYHtlzIbItUeOsgjJgWmylPnnP4vrkOCgpUg/viewform',
//   registerTime: '2020-05-13 07:00:00Z',
// },
// {
//   uuid: '36f03565-f622-43e6-90c5-fae022c5444y',
//   name: 'Southern Cup 2020',
//   league: 'University',
//   slug: 'southern-cup-2020',
//   location: { type: 'POINT', coordinates: ['-2.811808', '56.341305'] },
//   venue: 'Oxford Brookes Sports Park',
//   postcode: 'S9 1UA',
//   start_time: '2020-11-29 07:00:00Z',
//   images: ['https://images.prismic.io/chaser/ed7c8345-27c6-4517-8a60-954d641ad8b1_QD_FN-128+copy.jpg?auto=compress,format'],
//   icon: 'https://images.prismic.io/chaser/1a2c9d38-6c51-44af-8cd3-57a24b04d452_Southern-Cup-6-Tournament-Logo.png?auto=compress,format',
//   registerLink: 'https://docs.google.com/forms/d/e/1FAIpQLSdqKtdD2MoUfobYHtlzIbItUeOsgjJgWmylPnnP4vrkOCgpUg/viewform',
//   registerTime: '2020-09-13 07:00:00Z',
// },
// {
//   uuid: '36f03565-f622-43e6-90c5-fae022c5444x',
//   name: 'Community Fixture #1',
//   league: 'Community',
//   slug: 'community-fixture-1-2020',
//   location: { type: 'POINT', coordinates: ['-2.811808', '56.341305'] },
//   venue: 'Clapham Common',
//   postcode: 'SW4 0NH',
//   start_time: '2020-12-25 07:00:00Z',
//   images: ['https://images.prismic.io/chaser/d03c57e4-c3f3-4033-b08f-d0331d860ec4_57114819_3035649453142627_7886437477404114944_o.jpg?auto=compress,format'],
//   icon: 'https://images.prismic.io/chaser/1a2c9d38-6c51-44af-8cd3-57a24b04d452_Southern-Cup-6-Tournament-Logo.png?auto=compress,format',
//   registerLink: 'https://docs.google.com/forms/d/e/1FAIpQLSdqKtdD2MoUfobYHtlzIbItUeOsgjJgWmylPnnP4vrkOCgpUg/viewform',
//   registerTime: '2020-09-13 07:00:00Z',
// },
// ];

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

const handleChangePostcode = debounce(1000, async (postcode, setClubs, setEvents, showClubs, showEvents) => {
  const validPostcode = !postcode || !!postcode.match(postcodeRegex);
  if (!validPostcode) {
    return;
  }

  // TODO: IF YOU DON'T SET THE FULL URL AXIOS IGNORES THE EXTERNAL BASEURL
  // AND SEARCHES THE CLIENT URL INSTEAD, DESPITE BEING THE EXACT SAME REQUEST AS IN THE SERVER SIDE PROPS.
  // FIGURE OUT WHY AND FIX
  if (showClubs) {
    const { data: clubs } = await api.get(`https://api.quidditchuk.org/clubs/search?postcode=${postcode}`);
    setClubs(clubs);
  }

  if (showEvents) {
    const { data: events } = await api.get(`https://api.quidditchuk.org/events/search?postcode=${postcode}`);
    setEvents(events);
  }

  Router.push({
    pathname: Router.pathname,
    query: { postcode },
  }, {
    pathname: Router.pathname,
    query: { postcode },
  }, { shallow: true });
});

const AutoValidatePostcode = ({
  setClubs, setEvents, showClubs, showEvents,
}) => {
  const { values } = useFormikContext();

  useEffect(() => {
    handleChangePostcode(values.postcode, setClubs, setEvents, showClubs, showEvents);
  }, [values.postcode, setClubs, setEvents, showClubs, showEvents]);

  return null;
};

const validatePostcode = (value) => {
  let error;
  if (value && !value.match(postcodeRegex)) {
    error = true;
  }
  return error;
};

const FindQuidditch = ({ clubs: initialClubs, events: initialEvents }) => {
  const { query } = useRouter();

  const [showClubs, setShowClubs] = useState(true);
  const [showEvents, setShowEvents] = useState(true);
  const [clubs, setClubs] = useState(initialClubs);
  const [events, setEvents] = useState(initialEvents);

  const initialValues = {
    postcode: query.postcode || '',
  };

  const showNoClubsOrEvents = showClubs && showEvents && !clubs.length && !events.length;
  const showNoClubs = showClubs && !clubs.length && !showNoClubsOrEvents;
  const showNoEvents = showEvents && !events.length && !showNoClubsOrEvents;

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
          opacity={0.8}
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
              initialValues={initialValues}
              onSubmit={() => { }}
              enableReinitialize
            >
              {({ errors, touched }) => (
                <Form>
                  <HeadingHero fontSize={[4, 4, 6]} color="white" isBody>
                    Quidditch near
                    <Box display="inline-block">
                      <Field
                        name="postcode"
                        placeholder="Postcode"
                        as={Input}
                        size="8"
                        marginLeft={[2, 4]}
                        validate={validatePostcode}
                      />
                      {errors.postcode && touched.postcode && <Icon><CloseIcon /></Icon>}
                    </Box>
                    <AutoValidatePostcode setClubs={setClubs} setEvents={setEvents} showClubs={showClubs} showEvents={showEvents} />
                  </HeadingHero>
                </Form>
              )}
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
          {showClubs && !!clubs.length
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

          {showNoClubs && (
            <>
              {showEvents && !!events.length && (<Heading as="h2" fontSize={4} isBody color="primary">Clubs</Heading>)}
              <Flex alignItems="center" justifyContent="center" flexDirection="column">
                <Heading as="h2" fontSize={4} mt={0} mb={0} isBody textAlign="center" color="primary">No clubs matched your search</Heading>
                <p>We can still help! Adjust your filters, and if you&#39;re still out of luck click &#34;Contact us&#34; to help us to bring Quidditch to your area.</p>
                <Link href="/about/contact-us" passHref><a><Button variant="primary" type="button">Contact us</Button></a></Link>
              </Flex>
            </>
          )}

          {showEvents && !!events.length
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

          {showNoEvents && (
            <>
              {showClubs && !!clubs.length && (<Heading as="h2" fontSize={4} isBody color="primary">Events</Heading>)}
              <Flex alignItems="center" justifyContent="center" flexDirection="column">
                <Heading as="h2" fontSize={4} mt={0} mb={0} isBody textAlign="center" color="primary">No events matched your search</Heading>
                <p>We can still help! Adjust your filters, and if you&#39;re still out of luck click &#34;Contact us&#34; to help us to bring Quidditch to your area.</p>
                <Link href="/about/contact-us" passHref><a><Button variant="primary" type="button">Contact us</Button></a></Link>
              </Flex>
            </>
          )}

          {showNoClubsOrEvents
            && (
              <Flex alignItems="center" justifyContent="center" flexDirection="column">
                <Heading as="h2" fontSize={4} mt={0} mb={0} isBody textAlign="center" color="primary">No clubs or events matched your search</Heading>
                <p>We can still help! Adjust your filters, and if you&#39;re still out of luck click &#34;Contact us&#34; to help us to bring Quidditch to your area.</p>
                <Link href="/about/contact-us" passHref><a><Button variant="primary" type="button">Contact us</Button></a></Link>
              </Flex>
            )}
        </Container>
      </Box>
    </Layout>
  );
};

FindQuidditch.defaultProps = {
  clubs: [],
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
    const { data: events } = await api.get('/events/search');
    return {
      props: { clubs, events },
    };
  }

  const { data: clubs } = await api.get(`/clubs/search?postcode=${postcode}`);
  const { data: events } = await api.get(`/events/search?postcode=${postcode}`);

  return {
    props: { clubs, events },
  };
};

FindQuidditch.propTypes = {};

export default FindQuidditch;
