import { useEffect, useState } from 'react';
import Link from 'next/link';
import { StyledLink } from 'components/latest-news';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { parse } from 'date-fns';
import Router from 'next/router';
import * as Yup from 'yup';
import { api } from 'modules/api';
import { parseCookies } from 'modules/cookies';
import {
  Box,
  Grid,
  Flex,
  Heading,
  Select,
  Checkbox,
  Link as ChakraLink,
} from '@chakra-ui/react';
import Meta from 'components/meta';
import Container from 'components/container';
import Content from 'components/content';
import Label from 'components/label';
import Button from 'components/button';
import Required from 'components/required';
import { InlineError } from 'components/errors';
import ClubCard, { ACTIVE_STATUS } from 'components/club-card';
import Image from 'components/image';
import { event } from 'modules/analytics';
import { CATEGORIES } from 'constants/analytics';

const SelectClubSchema = Yup.object().shape({
  club_uuid: Yup.string().nullable().required('Required'),
  confirm: Yup.bool().oneOf(
    [true],
    'Please confirm that you have read the disclaimer'
  ),
});

const handleClubSubmit = async ({ club_uuid }, setServerError) => {
  try {
    setServerError(null);

    await api.put('/users/me', { club_uuid });

    event({
      category: CATEGORIES.MEMBERSHIP,
      action: 'Club selected',
    });

    Router.push('/dashboard');
  } catch (err) {
    setServerError(err?.response?.data?.error?.message);
  }
};

const ManageClub = ({ user, clubs = [] }) => {
  const [selectedClub, setSelectedClub] = useState(
    clubs.find(({ uuid }) => uuid === user.club_uuid)
  );
  const [serverError, setServerError] = useState(null);

  const { register, errors, handleSubmit, watch, formState } = useForm({
    resolver: yupResolver(SelectClubSchema),
    defaultValues: {
      club_uuid: user.club_uuid,
      confirm: false,
    },
  });

  const { isSubmitting } = formState;
  const currentSelectedClubUuid = watch('club_uuid', user.club_uuid);

  useEffect(() => {
    if (selectedClub.uuid !== currentSelectedClubUuid) {
      setSelectedClub(
        clubs.find(({ uuid }) => uuid === currentSelectedClubUuid)
      );
    }
  }, [selectedClub, setSelectedClub, currentSelectedClubUuid, clubs]);

  return (
    <>
      <Meta
        description="Sign in to QuidditchUK to manage your QuidditchUK Membership, Account details and more"
        subTitle="Manage"
      />
      <Box
        bg="greyLight"
        py={{ base: 4, lg: 10 }}
        px={{ base: 4, sm: 8, md: 9 }}
      >
        <Container>
          <Grid
            gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }}
            gridGap={{ base: 4, md: 9 }}
          >
            <Box
              bg="white"
              py={4}
              px={{ base: 4, sm: 8, md: 9 }}
              borderRadius="md"
            >
              <Heading as="h2" fontFamily="body" color="qukBlue" fontSize="3xl">
                Select your club
              </Heading>

              <Content>
                {user.club_uuid ? (
                  <>
                    <p>
                      You have selected <strong>{selectedClub?.name}</strong> as
                      your QuidditchUK Club.
                    </p>
                    <p>
                      If you need to change your club, you must submit a
                      transfer request to QuidditchUK to request any changes.
                    </p>
                    <Link href="/about/contact-us" passHref>
                      <ChakraLink>
                        <Button variant="secondary">Contact Us</Button>
                      </ChakraLink>
                    </Link>
                  </>
                ) : (
                  <>
                    <p>
                      Before confirming, please double check that you have
                      selected the correct club and they know you are joining
                      them this competitive season.
                    </p>
                    <p>
                      Please note that once you have chosen and locked in your
                      club you will not be able to undo it, and any changes will
                      have to be requested via a Club Transfer Request to
                      QuidditchUK.
                    </p>
                  </>
                )}
              </Content>

              {!user.club_uuid && (
                <form
                  onSubmit={handleSubmit((values) =>
                    handleClubSubmit(values, setServerError)
                  )}
                >
                  <Grid gridTemplateColumns="1fr" mt={5}>
                    <Label htmlFor="club_uuid" mb="2">
                      Select your club <Required />
                    </Label>

                    <Select
                      id="club_uuid"
                      name="club_uuid"
                      as="select"
                      ref={register}
                      bg="white"
                      color="qukBlue"
                    >
                      <option disabled value>
                        Select a club
                      </option>
                      {clubs.map((club) => (
                        <option key={club.uuid} value={club.uuid}>
                          {club.name}
                        </option>
                      ))}
                    </Select>

                    {errors.club_uuid && (
                      <InlineError mb={3}>
                        {errors.club_uuid.message}
                      </InlineError>
                    )}
                    <Label mt="3">
                      <Checkbox name="confirm" ref={register} spacing={3}>
                        By checking this box I acknowledge that I have read the
                        above disclaimer and I intend for{' '}
                        <strong>{selectedClub?.name}</strong> to be my
                        QuidditchUK club for the 2021/2022 Season.
                      </Checkbox>
                    </Label>

                    {errors.confirm && (
                      <InlineError mb={3}>{errors.confirm.message}</InlineError>
                    )}
                  </Grid>

                  <Button
                    mt="2"
                    type="submit"
                    variant="green"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting' : 'Select my club'}
                  </Button>
                </form>
              )}

              {serverError && <InlineError my={3}>{serverError}</InlineError>}
            </Box>
            {selectedClub && (
              <Flex flexDirection="column" key={selectedClub?.uuid}>
                <Link href={`/clubs/${selectedClub?.slug}`} passHref>
                  <StyledLink>
                    <ClubCard
                      backgroundColor={selectedClub.featured_color}
                      color={selectedClub.text_color}
                      name={selectedClub.name}
                      league={selectedClub.league}
                      venue={selectedClub.venue}
                      icon={selectedClub.icon}
                      status={selectedClub.status}
                      image={
                        selectedClub.images ? (
                          <Image
                            src={selectedClub.images[0]}
                            alt={selectedClub.name}
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

  const { data: clubs } = await api.get('/clubs/search');
  const { data: user } = await api.get('/users/me', {
    headers: {
      Authorization: `Bearer ${AUTHENTICATION_TOKEN}`,
    },
  });

  const { data: products } = await api.get('/products/me', {
    headers: {
      Authorization: `Bearer ${AUTHENTICATION_TOKEN}`,
    },
  });

  if (
    !products.length ||
    !products.filter(
      (product) =>
        new Date() < parse(product?.metadata?.expires, 'dd-MM-yyyy', new Date())
    ).length
  ) {
    res.setHeader('location', '/dashboard/membership/manage');
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }

  return {
    props: {
      clubs: clubs.filter(({ status }) => status === ACTIVE_STATUS),
      user,
    },
  };
};

export default ManageClub;
