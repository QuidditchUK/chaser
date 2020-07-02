/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Router, { useRouter } from 'next/router';
import Link from 'next/link';
import Slider from '@material-ui/core/Slider';

import {
  Formik,
  Form,
  Field,
  useFormikContext,
  FieldArray,
  useField,
} from 'formik';
import { api, createQueryString } from 'modules/api';
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
import Type, { TYPES } from 'components/club-type';
import { rem } from '../styles/theme';

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

const SHOW_TYPES = [
  { value: 'clubs', name: 'Clubs' },
  { value: 'events', name: 'Events' },
];

const LEAGUES = [
  { value: 'Community', name: 'Community' },
  { value: 'University', name: 'University' },
];

const Label = styled.label`
  padding: ${({ theme }) => theme.space[1]} ${({ theme }) => theme.space[2]};
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes[1]};

  border-radius: ${({ theme }) => theme.radii[1]};
  margin-bottom: ${({ theme }) => theme.space[1]};
  border: 1px solid;
  border-color: transparent;

  &:hover {
    background: ${({ theme }) => theme.colors.greyLight}; 
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Checkbox = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
`;

const Checkmark = styled.span`
  height: 25px;
  width: 25px;
  border-radius: 50%;

  &:after {
    content: "";
    display: none;
    position: relative;
    left: 10px;
    top: 7px;
    width: 5px;
    height: 10px;
    border: solid ${({ theme }) => theme.colors.white};
    border-width: 0 3px 3px 0;
    transform: rotate(45deg);
  }

  input:checked ~ & {
    background-color: ${({ theme }) => theme.colors.primary};
  }

  input:checked ~ &:after {
    display: block;
  }
`;

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

const DistanceSlider = ({
  min,
  max,
  defaultValue,
  ...props
}) => {
  const [field, , helpers] = useField(props);

  return (
    <Slider
      {...field}
      {...props}
      onBlur={(e) => helpers.setTouched(e)}
      onChange={(e, v) => helpers.setValue(v)}
      defaultValue={defaultValue}
      valueLabelDisplay="auto"
      min={min}
      max={max}
    />
  );
};

DistanceSlider.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

const handleChange = debounce(1000, async (values, setClubs, setEvents) => {
  const {
    postcode, showTypes, leagues, distance,
  } = values;
  const validPostcode = !postcode || !!postcode.match(postcodeRegex);
  if (!validPostcode) {
    return;
  }

  const searchLeagues = leagues.length > 0 ? leagues : ['Community', 'University'];
  const searchQuery = { ...values, leagues: searchLeagues, distance: (distance * 1000) };
  const queryString = createQueryString(searchQuery);
  const { data } = await api.get(`/search?${queryString}`);

  setClubs(data.clubs);
  setEvents(data.events);

  Router.push({
    pathname: Router.pathname,
    query: {
      postcode, showTypes, leagues, distance,
    },
  }, {
    pathname: Router.pathname,
    query: {
      postcode, showTypes, leagues, distance,
    },
  }, { shallow: true });
});

const AutoValidateForm = ({ setClubs, setEvents }) => {
  const { values } = useFormikContext();

  useEffect(() => {
    handleChange(values, setClubs, setEvents);
  }, [values, setClubs, setEvents]);

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
  const {
    postcode, showTypes, leagues, distance,
  } = query;

  const [showFilters, setShowFilters] = useState(false);

  const showClubs = showTypes?.includes('clubs');
  const showEvents = showTypes?.includes('events');

  const [clubs, setClubs] = useState(initialClubs);
  const [events, setEvents] = useState(initialEvents);

  let showTypesInitial;

  if (!showTypes) {
    showTypesInitial = null;
  } else if (Array.isArray(showTypes)) {
    showTypesInitial = showTypes;
  } else {
    showTypesInitial = [showTypes];
  }

  let leaguesInitial;

  if (!leagues) {
    leaguesInitial = null;
  } else if (Array.isArray(leagues)) {
    leaguesInitial = leagues;
  } else {
    leaguesInitial = [leagues];
  }

  const initialValues = {
    postcode: postcode || '',
    showTypes: showTypesInitial || ['clubs', 'events'],
    leagues: leaguesInitial || ['Community', 'University'],
    distance: distance || 100,
  };

  const showNoClubsOrEvents = showClubs && showEvents && !clubs.length && !events.length;
  const showNoClubs = showClubs && !clubs.length && !showNoClubsOrEvents;
  const showNoEvents = showEvents && !events.length && !showNoClubsOrEvents;

  return (
    <Layout>
      <Meta subTitle="Find Quidditch near you" description="Find your nearest clubs and upcoming Quidditch events in the UK" image="https://images.prismic.io/chaser/187adf69-c199-4a01-82db-179bf9ed72c5_ET2_0158.jpg?auto=compress,format&rect=0,0,3360,1959&w=3360&h=1959" />
      <Formik
        initialValues={initialValues}
        onSubmit={() => { }}
        enableReinitialize
      >
        {({ errors, touched, values }) => (
          <Form>
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
                    <AutoValidateForm setClubs={setClubs} setEvents={setEvents} />
                  </HeadingHero>
                </Container>
              </Flex>
            </Box>

            <Box bg="white" py={5}>
              <Container px={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}>
                <Button variant="light" type="button" onClick={() => setShowFilters(!showFilters)}>{showFilters ? 'Hide' : 'Show'} filters</Button>
              </Container>
            </Box>
            {showFilters
            && (
            <Box bg="white" py={5}>
              <Container px={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}>
                <Grid
                  gridGap={{ _: 4, m: 0 }}
                  gridTemplateColumns={{ _: '1fr 1fr', m: '1fr 1fr 1fr' }}
                  gridTemplateAreas={{ _: '"types leagues" "distance distance"', m: '"types leagues distance"' }}
                >
                  <Box
                    borderLeftStyle="solid"
                    borderLeftWidth={{ _: '0', m: '1px' }}
                    borderRightStyle="solid"
                    borderRightWidth="1px"
                    borderColor="lightGrey"
                    px="4"
                    gridArea="types"
                  >
                    <Heading as="h3" fontSize="2" isBody mt="0" px="2">Types {values.showTypes.length > 0 && `(${values.showTypes.length})`}</Heading>
                    <FieldArray
                      name="showTypes"
                      render={(arrayHelpers) => (
                        <Flex flexDirection="column">
                          {SHOW_TYPES.map((type) => (
                            <Label key={type.value}>
                              <Checkbox
                                name="showTypes"
                                type="checkbox"
                                value={type.value}
                                checked={values.showTypes.includes(type.value)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    arrayHelpers.push(type.value);
                                  } else {
                                    arrayHelpers.remove(values.showTypes.indexOf(type.value));
                                  }
                                }}
                              />{' '}
                              {type.name}
                              <Checkmark />
                            </Label>
                          ))}
                        </Flex>
                      )}
                    />
                  </Box>

                  <Box borderRightStyle="solid" borderRightWidth={{ _: '0', m: '1px' }} borderColor="lightGrey" px="4" gridArea="leagues">
                    <Heading as="h3" fontSize="2" isBody mt="0" px="2">Leagues {values.leagues.length > 0 && `(${values.leagues.length})`}</Heading>
                    <FieldArray
                      name="leagues"
                      render={(arrayHelpers) => (
                        <Flex flexDirection="column">
                          {LEAGUES.map((league) => (
                            <Label key={league.value}>
                              <Checkbox
                                name="leagues"
                                type="checkbox"
                                value={league.value}
                                checked={values.leagues.includes(league.value)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    arrayHelpers.push(league.value);
                                  } else {
                                    arrayHelpers.remove(values.leagues.indexOf(league.value));
                                  }
                                }}
                              />{' '}
                              <Type fontWeight="bold" fontSize={(rem(10))} bg={TYPES[league.name]}>{league.name}</Type><Checkmark />
                            </Label>
                          ))}
                        </Flex>
                      )}
                    />
                  </Box>

                  <Box
                    borderTopStyle="solid"
                    borderRightStyle="solid"
                    borderTopWidth={{ _: '1px', m: '0px' }}
                    borderRightWidth={{ _: '0px', m: '1px' }}
                    borderColor="lightGrey"
                    px="4"
                    py={{ _: 4, m: 0 }}
                    gridArea="distance"
                  >
                    <Heading as="h3" fontSize="2" isBody mt="0" px="0" paddingBottom={2}>Distance ({values.distance}km)</Heading>
                    <Box px="5">
                      <DistanceSlider
                        id="distanceSlider"
                        name="distance"
                        min={1}
                        max={500}
                        defaultValue={values.distance}
                        marks={[{ value: 1, label: '1km' }, { value: 100, label: '100km' }, { value: 500, label: '500km' }]}
                      />
                    </Box>
                  </Box>
                </Grid>
              </Container>
            </Box>
            )}
          </Form>
        )}
      </Formik>

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
                <Link href="/about/contact-us" passHref><a><Button variant="secondary" type="button">Contact us</Button></a></Link>
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
                <Link href="/about/contact-us" passHref><a><Button variant="secondary" type="button">Contact us</Button></a></Link>
              </Flex>
            </>
          )}

          {showNoClubsOrEvents
            && (
              <Flex alignItems="center" justifyContent="center" flexDirection="column">
                <Heading as="h2" fontSize={4} mt={0} mb={0} isBody textAlign="center" color="primary">No clubs or events matched your search</Heading>
                <p>We can still help! Adjust your filters, and if you&#39;re still out of luck click &#34;Contact us&#34; to help us to bring Quidditch to your area.</p>
                <Link href="/about/contact-us" passHref><a><Button variant="secondary" type="button">Contact us</Button></a></Link>
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
  const leagues = query.leagues || ['Community', 'University'];
  const searchQuery = { ...query, leagues, distance: ((query.distance || 100) * 1000) };
  const queryString = createQueryString(searchQuery);

  const { data } = await api.get(`/search?${queryString}`);

  return {
    props: {
      clubs: data.clubs,
      events: data.events,
    },
  };
};

FindQuidditch.propTypes = {};

export default FindQuidditch;
