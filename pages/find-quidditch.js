import { useState, useEffect, forwardRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import axios from 'axios';
import { useForm } from 'react-hook-form';

import {
  Box,
  Flex,
  Grid,
  Heading,
  Input as ChakraInput,
  Link,
  // Slider,
} from '@chakra-ui/react';

import { BLOG_MIN_HEIGHTS } from 'styles/hero-heights';
import { postcodeRegex } from 'modules/validations';
// import Type, { TYPES } from 'components/club-type';
// import { rem } from 'styles/theme';
import {
  getAllClubs,
  getClubs,
  getEvents,
  // getAllEvents,
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

const validPostcode = (value) => value && value.match(postcodeRegex);

const FindQuidditch = ({
  clubs: initialClubs = [],
  // events: initialEvents = [],
}) => {
  const router = useRouter();
  const {
    postcode,
    showCommunity,
    showUniversity,
    showClubs,
    showEvents,
    distance = 100,
  } = router.query;

  const [showFilters, setShowFilters] = useState(false);

  const [clubs, setClubs] = useState(initialClubs);
  const [, setEvents] = useState(null);
  // const [events, setEvents] = useState(initialEvents);

  const { register, handleSubmit, errors, watch } = useForm({
    mode: 'onBlur',
    defaultValues: {
      showClubs: showClubs ?? true,
      showEvents: showEvents ?? true,
      showCommunity: showCommunity ?? true,
      showUniversity: showUniversity ?? true,
      postcode: postcode || '',
      distance: distance ?? 100,
    },
  });

  const values = watch();

  useEffect(() => {
    const refreshQuery = async () => {
      if (!showClubs) {
        return;
      }

      if (!validPostcode(values.postcode)) {
        const clubs = await getAllClubs({
          community: values.showCommunity,
          university: values.showUniversity,
        });
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
        // const clubs = await getAllEvents();
        const events = [];
        setEvents(events);
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

  // useEffect(() => {
  //   router.push({
  //     pathname: router.pathname,
  //     query: {
  //       postcode: values.postcode,
  //       distance: values.distance,
  //       showCommunity: values.showCommunity,
  //       showUniversity: values.showUniversity,
  //       showClubs: values.showClubs,
  //       showEvents: values.showEvents,
  //     },
  //   },
  //   { shallow: true }
  // );
  // }, [values.postcode, values.distance, values.showCommunity, values.showUniversity, values.showClubs, values.showEvents, router]);

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
          backgroundColor="qukBlue"
          minHeight={BLOG_MIN_HEIGHTS}
        >
          <Image
            src="https://images.prismic.io/chaser/187adf69-c199-4a01-82db-179bf9ed72c5_ET2_0158.jpg?auto=compress,format&rect=0,0,3360,1959&w=3360&h=1959"
            layout="fill"
            objectFit="cover"
            borderRadius="0"
            objectPosition="center center"
            priority={true}
          />
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
                    Types (
                    {
                      [values.showClubs, values.showEvents].filter((v) => v)
                        .length
                    }
                    )
                  </Heading>
                </Box>

                <Box
                  borderRightStyle="solid"
                  borderRightWidth={{ base: '0', md: '1px' }}
                  borderColor="lightGrey"
                  px="4"
                  gridArea="leagues"
                >
                  <Heading as="h3" fontSize="2" fontFamily="body" mt="0" px="2">
                    Leagues (
                    {
                      [values.showCommunity, values.showUniversity].filter(
                        (v) => v
                      ).length
                    }
                    )
                  </Heading>
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
                    {/* <Slider
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
                    /> */}
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

          {values.showClubs && !!clubs.length && (
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
        </Container>
      </Box>
    </>
  );
};

export const getServerSideProps = async ({ query }) => {
  const invalidPostcode =
    !query.postcode || !!query.postcode.match(postcodeRegex);

  if (invalidPostcode) {
    const clubs = await getAllClubs({
      community: query.showCommunity ?? true,
      university: query.showUniversity ?? true,
    });
    // const events = await getAllEvents();
    const events = [];

    return {
      props: {
        clubs,
        events,
      },
    };
  }

  const { data } = await axios.get(
    `https://api.postcodes.io/postcodes/${query.postcode}`
  );

  let clubs = [];
  let events = [];

  if (query.clubs) {
    clubs = await getClubs({
      longitude: data.result.longitude,
      latitude: data.result.latitude,
      distance: query.distance ?? 100,
      community: query.showCommunity ?? true,
      university: query.showUniversity ?? true,
    });
  }

  // if (query.events) {
  //   events = await getEvents({
  //     longitude: data.result.longitude,
  //     latitude: data.result.latitude,
  //     distance: (query.distance ?? 100),
  //     community: (query.showCommunity ?? true),
  //     university: (query.showUniversity ?? true)
  //   });
  // }

  return {
    props: { clubs, events },
  };
};

export default FindQuidditch;
