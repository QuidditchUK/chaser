import { useState, useEffect, forwardRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
// import Router, { useRouter } from 'next/router';
import NextLink from 'next/link';
import axios from 'axios';
// import { debounce } from 'throttle-debounce';

import { useForm } from 'react-hook-form';

import {
  Box,
  Flex,
  Grid,
  Heading,
  Input as ChakraInput,
  Link,
  Slider,
} from '@chakra-ui/react';

import { BLOG_MIN_HEIGHTS } from 'styles/hero-heights';
import { postcodeRegex } from 'modules/validations';
// import Type, { TYPES } from 'components/club-type';
// import { rem } from 'styles/theme';
import {
  getAllClubs,
  getClubs,
  getEvents,
  getAllEvents,
} from 'modules/prismic';

const Notification = dynamic(() => import('components/notification'));
const Content = dynamic(() => import('components/content'));
const CloseIcon = dynamic(() => import('public/images/close.svg'));
const Container = dynamic(() => import('components/container'));

const ClubCard = dynamic(() => import('components/club-card'));
// const EventCard = dynamic(() => import('components/event-card'));
const Image = dynamic(() => import('components/image'));
const Meta = dynamic(() => import('components/meta'));
const Button = dynamic(() => import('components/button'));

// const Slider = dynamic(() => import('@material-ui/core/Slider'));

// const SHOW_TYPES = [
//   { value: 'events', name: 'Events' },
//   { value: 'clubs', name: 'Clubs' },
// ];

// const LEAGUES = [
//   { value: 'Community', name: 'Community' },
//   { value: 'University', name: 'University' },
// ];

const IconWrapper = (props) => (
  <Box display="inline-block" w="30px" {...props} />
);
const Icon = (props) => (
  <Box
    h="30px"
    w="30px"
    sx={{ filter: 'drop-shadow(0 0 0.2rem rgb(0, 0, 0))' }}
    {...props}
  />
);

const Input = forwardRef(function Input(props, ref) {
  return (
    <ChakraInput
      ref={ref}
      bg="transparent"
      border="0"
      borderBottom="3px solid"
      borderColor="white"
      color="white"
      outline="0"
      _placeholder={{
        color: 'white',
        opacity: 0.8,
      }}
      {...props}
    />
  );
});

const StyledLink = forwardRef(function StyledLink(props, ref) {
  return (
    <Link
      ref={ref}
      textDecoration="none"
      display="flex"
      flexDirection="column"
      flexGrow="1"
      _hover={{ textDecoration: 'none' }}
      {...props}
    />
  );
});

// const DistanceSlider = ({ min, max, defaultValue, ...props }) => {
//   // const [field, , helpers] = useField(props);

//   return (
//     <Slider
//       // {...field}
//       // {...props}
//       // onBlur={(e) => helpers.setTouched(e)}
//       // onChange={(e, v) => helpers.setValue(v)}
//       defaultValue={defaultValue}
//       valueLabelDisplay="auto"
//       min={min}
//       max={max}
//     />
//   );
// };

// const handleChange = debounce(1000, async (values, setClubs, setEvents) => {
//   const { postcode, showTypes, leagues, distance } = values;
//   const validPostcode = !postcode || !!postcode.match(postcodeRegex);
//   if (!validPostcode) {
//     return;
//   }

//   const searchLeagues =
//     leagues.length > 0 ? leagues : ['Community', 'University'];
//   const searchQuery = {
//     ...values,
//     leagues: searchLeagues,
//     distance,
//   };
//   // const queryString = createQueryString(searchQuery);
//   // const { data } = await api.get(`/search?${queryString}`);

//   setClubs(data.clubs);
//   setEvents(data.events);

//   Router.push(
//     {
//       pathname: Router.pathname,
//       query: {
//         postcode,
//         showTypes,
//         leagues,
//         distance,
//       },
//     },
//     {
//       pathname: Router.pathname,
//       query: {
//         postcode,
//         showTypes,
//         leagues,
//         distance,
//       },
//     },
//     { shallow: true }
//   );
// });

const validPostcode = (value) => value && value.match(postcodeRegex);

const FindQuidditch = ({
  clubs: initialClubs = [],
  // events: initialEvents = [],
}) => {
  const { query } = useRouter();
  const { postcode, showCommunity, showUniversity, distance = 100 } = query;

  const [showFilters, setShowFilters] = useState(false);
  const showClubs = true;
  const showEvents = false;
  // const [showClubs, setShowClubs] = useState(true);
  // const [showEvents, setShowEvents] = useState(false);

  const [clubs, setClubs] = useState(initialClubs);
  const [, setEvents] = useState(null);
  // const [events, setEvents] = useState(initialEvents);

  const { register, handleSubmit, errors, watch } = useForm({
    mode: 'onBlur',
    defaultValues: {
      showCommunity: showCommunity || true,
      showUniversity: showUniversity || true,
      postcode: postcode || '',
      distance: distance || 100,
    },
  });

  const values = watch();

  useEffect(() => {
    const refreshQuery = async () => {
      if (!showClubs) {
        return;
      }

      if (!validPostcode(values.postcode)) {
        const clubs = await getAllClubs();
        setClubs(clubs);
        return;
      }

      try {
        const { data } = await axios.get(
          `https://api.postcodes.io/postcodes/${values.postcode}`
        );

        const clubs = await getClubs({
          longitude: data.result.longitude,
          latitude: data.result.latitude,
          distance: distance,
          community: values.showCommunity,
          university: values.showUniversity,
        });
        setClubs(clubs);
      } catch (err) {
        console.log(err);
      }
    };

    refreshQuery();
  }, [
    values.postcode,
    distance,
    values.showCommunity,
    values.showUniversity,
    setClubs,
    showClubs,
  ]);

  useEffect(() => {
    const refreshQuery = async () => {
      if (!showEvents) {
        return;
      }

      if (!validPostcode(values.postcode)) {
        const clubs = await getAllEvents();
        setEvents(clubs);
        return;
      }

      try {
        const { data } = await axios.get(
          `https://api.postcodes.io/postcodes/${values.postcode}`
        );

        const events = await getEvents({
          longitude: data.result.longitude,
          latitude: data.result.latitude,
          distance: values.distance,
          community: values.showCommunity,
          university: values.showUniversity,
        });

        setEvents(events);
      } catch (err) {
        console.log(err);
      }
    };

    refreshQuery();
  }, [
    values.postcode,
    values.distance,
    values.showCommunity,
    values.showUniversity,
    setEvents,
    showEvents,
  ]);

  // let showTypesInitial;

  // if (!showTypes) {
  //   showTypesInitial = null;
  // } else if (Array.isArray(showTypes)) {
  //   showTypesInitial = showTypes;
  // } else {
  //   showTypesInitial = [showTypes];
  // }

  // let leaguesInitial;

  // if (!leagues) {
  //   leaguesInitial = null;
  // } else if (Array.isArray(leagues)) {
  //   leaguesInitial = leagues;
  // } else {
  //   leaguesInitial = [leagues];
  // }

  // const initialValues = {
  //   postcode: postcode || '',
  //   showTypes: showTypesInitial || ['clubs'],
  //   // showTypes: showTypesInitial || ['clubs', 'events'], // TODO: REMOVED DUE TO COVID, RETURN ONCE NORMALITY RESUMES
  //   leagues: leaguesInitial || ['Community', 'University'],
  //   distance: distance || 100,
  // };

  // const showClubs = initialValues.showTypes?.includes('clubs');
  // const showEvents = initialValues.showTypes?.includes('events');

  // const showNoClubsOrEvents =
  //   showClubs && showEvents && !clubs.length && !events.length;
  // const showNoClubs = showClubs && !clubs.length && !showNoClubsOrEvents;
  // const showNoEvents = showEvents && !events.length && !showNoClubsOrEvents;

  return (
    <>
      <Meta
        subTitle="Find Quidditch near you"
        description="Find your nearest clubs and upcoming Quidditch events in the UK"
        image="https://images.prismic.io/chaser/187adf69-c199-4a01-82db-179bf9ed72c5_ET2_0158.jpg?auto=compress,format&rect=0,0,3360,1959&w=3360&h=1959"
      />
      <form onSubmit={handleSubmit()}>
        <Box
          as="section"
          position="relative"
          backgroundImage="url(https://images.prismic.io/chaser/187adf69-c199-4a01-82db-179bf9ed72c5_ET2_0158.jpg?auto=compress,format&rect=0,0,3360,1959&w=3360&h=1959)"
          backgroundColor="qukBlue"
          backgroundSize="cover"
          backgroundPosition="center"
          minHeight={BLOG_MIN_HEIGHTS}
        >
          <Flex
            position="absolute"
            minHeight={BLOG_MIN_HEIGHTS}
            bg="qukBlue"
            opacity={0.8}
            width="100%"
          />

          <Flex
            position="relative"
            minHeight={BLOG_MIN_HEIGHTS}
            alignItems="center"
          >
            <Container px={{ base: 4, sm: 8, md: 9 }}>
              <Heading
                fontSize={{ base: '3xl', lg: '5xl' }}
                color="white"
                fontFamily="body"
                textShadow="lg"
              >
                Quidditch near
                <Box display="inline-block">
                  <Input
                    name="postcode"
                    placeholder="Postcode"
                    ref={register}
                    size="8"
                    marginLeft={[2, 4]}
                  />
                  {errors.postcode && (
                    <IconWrapper>
                      <Icon as={CloseIcon} />
                    </IconWrapper>
                  )}
                </Box>
              </Heading>
            </Container>
          </Flex>
        </Box>

        <Box bg="white" py={5}>
          <Container px={{ base: 4, sm: 8, md: 9 }}>
            <Button
              variant="light"
              type="button"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Hide' : 'Show'} filters
            </Button>
          </Container>
        </Box>
        {showFilters && (
          <Box bg="white" py={5}>
            <Container px={{ base: 4, sm: 8, md: 9 }}>
              <Grid
                gridGap={{ base: 4, md: 0 }}
                gridTemplateColumns={{ base: '1fr 1fr', md: '1fr 1fr 1fr' }}
                gridTemplateAreas={{
                  base: '"types leagues" "distance distance"',
                  md: '"types leagues distance"',
                }}
              >
                <Box
                  borderLeftStyle="solid"
                  borderLeftWidth={{ base: '0', md: '1px' }}
                  borderRightStyle="solid"
                  borderRightWidth="1px"
                  borderColor="lightGrey"
                  px="4"
                  gridArea="types"
                >
                  <Heading as="h3" fontSize="2" fontFamily="body" mt="0" px="2">
                    Types{' '}
                    {values.showTypes.length > 0 &&
                      `(${values.showTypes.length})`}
                  </Heading>
                  {/* <FieldArray
                        name="showTypes"
                        render={(arrayHelpers) => (
                          <Flex flexDirection="column">
                            {SHOW_TYPES.map((type) => (
                              <Label key={type.value}>
                                <Checkbox
                                  name="showTypes"
                                  type="checkbox"
                                  value={type.value}
                                  checked={values.showTypes.includes(
                                    type.value
                                  )}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      arrayHelpers.push(type.value);
                                    } else {
                                      arrayHelpers.remove(
                                        values.showTypes.indexOf(type.value)
                                      );
                                    }
                                  }}
                                />{' '}
                                {type.name}
                                <Checkmark />
                              </Label>
                            ))}
                          </Flex>
                        )}
                      /> */}
                </Box>

                <Box
                  borderRightStyle="solid"
                  borderRightWidth={{ base: '0', md: '1px' }}
                  borderColor="lightGrey"
                  px="4"
                  gridArea="leagues"
                >
                  <Heading as="h3" fontSize="2" fontFamily="body" mt="0" px="2">
                    Leagues{' '}
                    {values.leagues.length > 0 && `(${values.leagues.length})`}
                  </Heading>
                  {/* <FieldArray
                        name="leagues"
                        render={(arrayHelpers) => (
                          <Flex flexDirection="column">
                            {LEAGUES.map((league) => (
                              <Label key={league.value}>
                                <Checkbox
                                  name="leagues"
                                  type="checkbox"
                                  value={league.value}
                                  checked={values.leagues.includes(
                                    league.value
                                  )}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      arrayHelpers.push(league.value);
                                    } else {
                                      arrayHelpers.remove(
                                        values.leagues.indexOf(league.value)
                                      );
                                    }
                                  }}
                                />{' '}
                                <Type
                                  fontWeight="bold"
                                  fontSize={rem(10)}
                                  bg={TYPES[league.name]}
                                >
                                  {league.name}
                                </Type>
                                <Checkmark />
                              </Label>
                            ))}
                          </Flex>
                        )}
                      /> */}
                </Box>

                <Box
                  borderTopStyle="solid"
                  borderRightStyle="solid"
                  borderTopWidth={{ base: '1px', md: '0px' }}
                  borderRightWidth={{ base: '0px', md: '1px' }}
                  borderColor="lightGrey"
                  px="4"
                  py={{ base: 4, md: 0 }}
                  gridArea="distance"
                >
                  <Heading
                    as="h3"
                    fontSize="2"
                    fontFamily="body"
                    mt="0"
                    px="0"
                    paddingBottom={2}
                  >
                    Distance ({values.distance}km)
                  </Heading>
                  <Box px="5">
                    <Slider
                      id="distanceSlider"
                      name="distance"
                      min={1}
                      max={500}
                      defaultValue={values.distance}
                      marks={[
                        { value: 1, label: '1km' },
                        { value: 100, label: '100km' },
                        { value: 500, label: '500km' },
                      ]}
                    />
                  </Box>
                </Box>
              </Grid>
            </Container>
          </Box>
        )}
      </form>

      <Box bg="greyLight" py={{ base: 6, lg: 10 }}>
        <Container px={{ base: 4, sm: 8, md: 9 }}>
          <Notification>
            <Heading as="h2" fontSize="xl" fontFamily="body">
              Events during COVID-19
            </Heading>
            <Content>
              All QuidditchUK Events are currently postponed due to the
              Coronavirus Pandemic. For the latest COVID guidance head to our{' '}
              <NextLink href="/[id]" as="/covid" passHref>
                <Link color="monarchRed">COVID page</Link>
              </NextLink>
            </Content>
          </Notification>

          {/* {showEvents && !!events.length && (
            <>
              <Heading
                as="h2"
                fontSize={4}
                fontFamily="body"
                mt={0}
                color="qukBlue"
              >
                Events
              </Heading>

              <Grid
                gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }}
                gridGap={{ base: 4, sm: 8, md: 9 }}
              >
                {events.map((event) => (
                  <Flex flexDirection="column" key={event.uuid}>
                    <Link
                      href="/events/[event]"
                      as={`/events/${event.slug}`}
                      passHref
                    >
                      <StyledLink>
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
                      </StyledLink>
                    </Link>
                  </Flex>
                ))}
              </Grid>
            </>
          )}

          {showNoEvents && (
            <>
              {showClubs && !!clubs.length && (
                <Heading as="h2" fontSize={4} fontFamily="body" color="qukBlue">
                  Events
                </Heading>
              )}
              <Flex
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
              >
                <Heading
                  as="h2"
                  fontSize={4}
                  mt={0}
                  mb={0}
                  fontFamily="body"
                  textAlign="center"
                  color="qukBlue"
                >
                  No events matched your search
                </Heading>
                <p>
                  We can still help! Adjust your filters, and if you&#39;re
                  still out of luck click &#34;Contact us&#34; to help us to
                  bring Quidditch to your area.
                </p>
                <Link href="/about/contact-us" passHref>
                  <a>
                    <Button variant="secondary" type="button">
                      Contact us
                    </Button>
                  </a>
                </Link>
              </Flex>
            </>
          )} */}

          {showClubs && !!clubs.length && (
            <>
              <Heading as="h2" fontSize="3xl" fontFamily="body" color="qukBlue">
                Clubs
              </Heading>

              <Grid
                gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }}
                gridGap={{ base: 4, md: 9 }}
                pb={3}
              >
                {clubs.map((club) => (
                  <Flex flexDirection="column" key={club.uid}>
                    <NextLink href={`/clubs/${club.uid}`} passHref>
                      <StyledLink>
                        <ClubCard
                          backgroundColor={club.data.featured_color}
                          color={club.data.text_color}
                          name={club.data.club_name}
                          league={club.data.league}
                          venue={club.data.venue}
                          icon={club.data.icon.url}
                          status={club.data.active}
                          image={
                            club.data.images ? (
                              <Image
                                src={club.data.images?.[0].image.url}
                                alt={club.club_name}
                                width={1600}
                                height={900}
                                borderRadius="0px"
                              />
                            ) : null
                          }
                        />
                      </StyledLink>
                    </NextLink>
                  </Flex>
                ))}
              </Grid>
            </>
          )}

          {/* {showNoClubs && (
            <>
              {showEvents && !!events.length && (
                <Heading as="h2" fontSize={4} fontFamily="body" color="qukBlue">
                  Clubs
                </Heading>
              )}
              <Flex
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
              >
                <Heading
                  as="h2"
                  fontSize={4}
                  mt={0}
                  mb={0}
                  fontFamily="body"
                  textAlign="center"
                  color="qukBlue"
                >
                  No clubs matched your search
                </Heading>
                <p>
                  We can still help! Adjust your filters, and if you&#39;re
                  still out of luck click &#34;Contact us&#34; to help us to
                  bring Quidditch to your area.
                </p>
                <Link href="/about/contact-us" passHref>
                  <a>
                    <Button variant="secondary" type="button">
                      Contact us
                    </Button>
                  </a>
                </Link>
              </Flex>
            </>
          )} */}

          {/* {showNoClubsOrEvents && (
            <Flex
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
            >
              <Heading
                as="h2"
                fontSize={4}
                mt={0}
                mb={0}
                fontFamily="body"
                textAlign="center"
                color="qukBlue"
              >
                No clubs or events matched your search
              </Heading>
              <p>
                We can still help! Adjust your filters, and if you&#39;re still
                out of luck click &#34;Contact us&#34; to help us to bring
                Quidditch to your area.
              </p>
              <Link href="/about/contact-us" passHref>
                <a>
                  <Button variant="secondary" type="button">
                    Contact us
                  </Button>
                </a>
              </Link>
            </Flex>
          )} */}
        </Container>
      </Box>
    </>
  );
};

export const getServerSideProps = async ({ query }) => {
  const invalidPostcode =
    !query.postcode || !!query.postcode.match(postcodeRegex);

  if (invalidPostcode) {
    const clubs = await getAllClubs();
    // const events = await getAllEvents();
    const events = [];

    return {
      props: {
        clubs,
        events,
      },
    };
  }
};

export default FindQuidditch;
