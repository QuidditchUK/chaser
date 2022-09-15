import { useState, useEffect, forwardRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Image from 'next/image';
import axios from 'axios';
import { useForm, Controller } from 'react-hook-form';

import {
  Box,
  Flex,
  Grid,
  Heading,
  Input as ChakraInput,
  Text,
  Checkbox,
  Stack,
  Slider,
  SliderThumb,
  SliderTrack,
  SliderFilledTrack,
  useDisclosure,
  Collapse,
} from '@chakra-ui/react';

import { BLOG_MIN_HEIGHTS } from 'styles/hero-heights';
import { postcodeRegex } from 'modules/validations';
import { getAllClubs, getClubs, getBasePageProps } from 'modules/prismic';
import RegisterClubForm from 'components/prismic/forms/register-club-form';
import { ClubCardV2 } from 'components/clubsEvents/club-card';

const CloseIcon = dynamic(() => import('public/images/close.svg'));
const Container = dynamic(() => import('components/layout/container'));

const Meta = dynamic(() => import('components/shared/meta'));
const Button = dynamic(() => import('components/shared/button'));

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

const validPostcode = (value) => value && value.match(postcodeRegex);

const FindQuidditch = ({ clubs: initialClubs = [] }) => {
  const router = useRouter();
  const {
    postcode,
    showUniversity,
    showCommunity,
    distance = 100,
  } = router.query;

  const { isOpen, onToggle } = useDisclosure();
  const [postcodeData, setPostcodeData] = useState(null);
  const [showLocation, setShowLocation] = useState(false);

  const [clubs, setClubs] = useState(initialClubs);
  const [distanceIndicator, setDistanceIndicator] = useState(100);

  const {
    handleSubmit,
    formState: { errors },
    watch,
    control,
    register,
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      showUniversity: showUniversity ?? true,
      showCommunity: showCommunity ?? true,
      postcode: postcode || '',
      distance: distance ?? 100,
    },
  });

  const watchShowUniversity = watch('showUniversity', showUniversity ?? true);
  const watchShowCommunity = watch('showCommunity', showCommunity ?? true);
  const watchPostcode = watch('postcode', postcode ?? '');
  const watchDistance = watch('distance', postcode ?? 100);

  useEffect(() => {
    const refreshQuery = async () => {
      if (!validPostcode(watchPostcode)) {
        const clubs = await getAllClubs({
          showCommunity: watchShowCommunity,
          showUniversity: watchShowUniversity,
        });

        setPostcodeData(null);
        setClubs(clubs);

        return;
      }

      try {
        const { data } = await axios.get(
          `https://api.postcodes.io/postcodes/${watchPostcode}`
        );

        setPostcodeData(data?.result);

        const clubs = await getClubs({
          longitude: data.result.longitude,
          latitude: data.result.latitude,
          distance: watchDistance,
          showCommunity: watchShowCommunity,
          showUniversity: watchShowUniversity,
        });
        setClubs(clubs);
      } catch (err) {
        console.log(err);
      }
    };

    refreshQuery();
  }, [
    watchPostcode,
    watchDistance,
    watchShowCommunity,
    watchShowUniversity,
    setClubs,
    setPostcodeData,
  ]);

  return (
    <>
      <Meta
        subTitle="Find Quidditch"
        description="Find your nearest clubs and upcoming Quidditch events in the UK"
        image="https://images.prismic.io/chaser/187adf69-c199-4a01-82db-179bf9ed72c5_ET2_0158.jpg?auto=compress,format&rect=0,0,3360,1959&w=3360&h=1959"
      />
      <form onSubmit={handleSubmit(() => {})}>
        <Flex
          as="section"
          position="relative"
          backgroundColor="qukBlue"
          minHeight={BLOG_MIN_HEIGHTS}
          justifyContent="space-between"
          flexDirection="column"
        >
          <Image
            src="https://images.prismic.io/chaser/187adf69-c199-4a01-82db-179bf9ed72c5_ET2_0158.jpg?auto=compress,format&rect=0,0,3360,1959&w=3360&h=1959"
            alt="Player shoots the ball while being tackled"
            layout="fill"
            objectFit="cover"
            objectPosition="center center"
            priority={true}
          />
          <Flex
            position="absolute"
            minHeight={BLOG_MIN_HEIGHTS}
            bg="qukBlue"
            opacity={0.8}
            width="100%"
            height="100%"
          />

          <Flex
            position="relative"
            minHeight={BLOG_MIN_HEIGHTS}
            direction="column"
            justifyContent="center"
            bgGradient={
              isOpen ? 'linear(to-t, qukBlue, rgba(0, 0, 0, 0))' : 'none'
            }
          >
            <Container px={{ base: 4, sm: 8, md: 9 }} width="100%">
              <Heading
                fontSize={{ base: '3xl', lg: '5xl' }}
                color="white"
                fontFamily="body"
                textShadow="lg"
                mb={2}
              >
                <Box as="span" display="inline-block" mr={[2, 4]}>
                  {' '}
                  Quidditch near
                </Box>
                <Box
                  onClick={() => setShowLocation(false)}
                  opacity={showLocation ? 1 : 0}
                  display={showLocation ? 'inline-block' : 'none'}
                >
                  <Text
                    fontWeight="normal"
                    pt={'6px'}
                    m={0}
                    borderBottom="3px solid"
                    borderColor="white"
                    pb={'7px'}
                    minWidth={{ base: '200px', md: '300px' }}
                  >
                    {postcodeData?.parliamentary_constituency}
                  </Text>
                </Box>
                <Box
                  display={showLocation ? 'none' : 'inline-block'}
                  opacity={showLocation ? 0 : 1}
                >
                  <Input
                    {...register('postcode')}
                    id="postcode"
                    placeholder="Postcode"
                    size="8"
                    width={{ base: '200px', md: '300px' }}
                    onBlur={postcodeData ? () => setShowLocation(true) : null}
                  />

                  {errors.postcode && (
                    <IconWrapper>
                      <Icon as={CloseIcon} />
                    </IconWrapper>
                  )}
                </Box>
              </Heading>
              <Collapse in={!isOpen} animateOpacity>
                <Button
                  variant="transparent"
                  type="button"
                  onClick={onToggle}
                  mt={{ base: 1, sm: 'inherit' }}
                >
                  Show filters
                </Button>
              </Collapse>
            </Container>

            <Collapse in={isOpen} animateOpacity>
              <Box py={5} color="white">
                <Container px={{ base: 4, sm: 8, md: 9 }}>
                  <Grid
                    gridGap={{ base: 4, md: 0 }}
                    gridTemplateColumns="1fr 1fr"
                    gridTemplateAreas={{
                      base: "'leagues leagues' 'distance distance'",
                      md: '"leagues distance"',
                    }}
                  >
                    <Box p="4" gridArea="leagues">
                      <Heading as="h3" fontSize="xl" fontFamily="body" mt="0">
                        Leagues (
                        {
                          [watchShowCommunity, watchShowUniversity].filter(
                            (v) => v
                          ).length
                        }
                        )
                      </Heading>
                      <Stack spacing={2} direction="column">
                        <Box
                          _hover={{ bg: 'purple.700' }}
                          rounded="md"
                          width="100%"
                          transition={'all .3s ease'}
                          p={2}
                        >
                          <Checkbox
                            {...register('showCommunity')}
                            id="showCommunity"
                            size="md"
                            w="100%"
                            colorScheme="white"
                          >
                            Community
                          </Checkbox>
                        </Box>

                        <Box
                          _hover={{ bg: 'green.700' }}
                          rounded="md"
                          width="100%"
                          transition={'all .3s ease'}
                          p={2}
                        >
                          <Checkbox
                            {...register('showUniversity')}
                            id="showUniversity"
                            size="md"
                            w="100%"
                            colorScheme="white"
                          >
                            University
                          </Checkbox>
                        </Box>
                      </Stack>
                    </Box>

                    <Box borderRadius="md" p={4} gridArea="distance">
                      <Heading
                        as="h3"
                        fontSize="xl"
                        fontFamily="body"
                        px="0"
                        mt="0"
                      >
                        Distance ({distanceIndicator}km)
                      </Heading>
                      <Box>
                        <Controller
                          control={control}
                          name="distance"
                          render={({ field }) => {
                            return (
                              <Slider
                                name="distance"
                                defaultValue={100}
                                onChangeEnd={field.onChange}
                                onChange={(val) => setDistanceIndicator(val)}
                                min={1}
                                max={500}
                                aria-label="Distance Slider"
                                colorScheme="white"
                              >
                                <SliderTrack>
                                  <SliderFilledTrack bg="monarchRed" />
                                </SliderTrack>
                                <SliderThumb />
                              </Slider>
                            );
                          }}
                        />
                      </Box>
                      <Button
                        mt={4}
                        variant="transparent"
                        type="button"
                        onClick={onToggle}
                      >
                        Hide filters
                      </Button>
                    </Box>
                  </Grid>
                </Container>
              </Box>
            </Collapse>
          </Flex>
        </Flex>
      </form>

      <Box bg="greyLight" py={{ base: 6 }}>
        <Container px={{ base: 4, sm: 8, md: 9 }}>
          {!!clubs.length && (
            <>
              <Heading
                as="h2"
                fontSize="3xl"
                fontFamily="body"
                color="qukBlue"
                mt={3}
              >
                Clubs
              </Heading>

              <Grid
                gridTemplateColumns={{
                  base: '1fr',
                  md: 'repeat(auto-fit, minmax(300px, 1fr))',
                }}
                gridGap={{ base: 8, md: 9 }}
                pb={3}
              >
                {clubs.map((club) => (
                  <Flex flexDirection="column" key={club.uid}>
                    <ClubCardV2
                      bg={club?.data?.featured_color}
                      color={club.data.text_color}
                      title={club.data.club_name}
                      href={`/clubs/${club.uid}`}
                      league={club.data.league}
                      venue={club.data.venue}
                      icon={club.data.icon.url}
                      status={club.data.active}
                      tournament_results={club.data.tournament_results}
                      image={{
                        src: club?.data?.images?.[0]?.image?.url,
                        alt: club?.data?.club_name,
                      }}
                    />
                  </Flex>
                ))}
              </Grid>
            </>
          )}

          {clubs.length === 0 && (
            <Flex
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
            >
              <Heading
                as="h2"
                fontSize="3xl"
                mb={0}
                fontFamily="body"
                textAlign="center"
                color="primary"
              >
                No clubs matched your search
              </Heading>
              <p>
                We can still help! Adjust your filters, or if you are ready to
                bring Quidditch to your area, fill out the form below to
                register your club with QuidditchUK
              </p>
            </Flex>
          )}
        </Container>
      </Box>

      <RegisterClubForm
        primary={{
          variant: 'dark',
          image: {
            url: 'https://images.prismic.io/chaser/bd3471a2-96d8-44a3-8357-df414a44f5fb_day1_pk_c-20.jpg?auto=compress,format',
            alt: '',
          },
        }}
      />
    </>
  );
};

export const getServerSideProps = async ({ query }) => {
  const basePageProps = await getBasePageProps();

  if (!validPostcode(query.postcode)) {
    const clubs = await getAllClubs({
      showCommunity: true,
      showUniversity: true,
    });

    return {
      props: { clubs, ...basePageProps },
    };
  }

  const { data } = await axios.get(
    `https://api.postcodes.io/postcodes/${query.postcode}`
  );

  const clubs = await getClubs({
    longitude: data.result.longitude,
    latitude: data.result.latitude,
    distance: query.distance ?? 100,
    showCommunity: query.showCommunity,
    showUniversity: query.showUniversity,
  });

  return {
    props: { clubs, ...basePageProps },
  };
};

export default FindQuidditch;
