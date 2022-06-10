import { useState } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import { object, string, bool } from 'yup';
import dynamic from 'next/dynamic';
import { Heading, Grid, Flex, Switch, Select, Text } from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { api } from 'modules/api';
import { CLUBS_READ, CLUBS_WRITE, EMT } from 'constants/scopes';
import Slice from 'components/shared/slice';
import Input from 'components/formControls/input'; // DO NOT DYNAMIC IMPORT, BREAKS FORMS

import isAuthorized from 'modules/auth';
import { getBasePageProps } from 'modules/prismic';

const Label = dynamic(() => import('components/formControls/label'));
const Button = dynamic(() => import('components/shared/button'));
const Required = dynamic(() => import('components/formControls/required'));
const InlineError = dynamic(() =>
  import('components/shared/errors').then(({ InlineError }) => InlineError)
);

const LEAGUES = ['Community', 'University'];

const CreateClubSchema = object().shape({
  email: string()
    .nullable()
    .email('Invalid email address')
    .required('Please enter a valid email address'),
  name: string().required('Please enter a club name'),
  slug: string().required('Please enter the prismic club uid'),
  active: bool().required(),
  league: string().nullable(),
});

const handleCreateSubmit = async (values, setServerError) => {
  try {
    setServerError(null);

    const { data: club } = await api.post(`clubs`, values);

    Router.push(`/admin/clubs/${club.uuid}`);
  } catch (err) {
    setServerError(err?.response?.data?.error?.message);
  }
};
const Dashboard = () => {
  const [serverError, setServerError] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(CreateClubSchema),
    defaultValues: {
      email: '',
      name: '',
      slug: '',
      active: false,
      league: null,
    },
  });

  return (
    <Slice>
      <Heading as="h3" fontFamily="body" color="qukBlue">
        <Link href="/admin">Dashboard</Link> /{' '}
        <Link href="/admin/clubs/">Clubs</Link> / New
      </Heading>
      <form
        onSubmit={handleSubmit((values) =>
          handleCreateSubmit(values, setServerError)
        )}
      >
        <Grid
          bg="gray.100"
          p={4}
          borderRadius="lg"
          gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }}
          width="100%"
        >
          <Flex direction="column">
            <Label htmlFor="name">
              Name <Required />
            </Label>

            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input
                  {...field}
                  id="name"
                  placeholder="Club name"
                  my={3}
                  error={errors.name}
                />
              )}
            />

            {errors.name && (
              <InlineError marginBottom={3}>{errors.name.message}</InlineError>
            )}

            <Label htmlFor="email">
              Email Address <Required />
            </Label>

            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <Input
                  {...field}
                  id="email"
                  placeholder="Club email address"
                  my={3}
                  error={errors.email}
                />
              )}
            />

            {errors.email && (
              <InlineError marginBottom={3}>{errors.email.message}</InlineError>
            )}

            <Label htmlFor="slug">
              Prismic UID <Required />
            </Label>

            <Controller
              control={control}
              name="slug"
              render={({ field }) => (
                <Input
                  {...field}
                  id="slug"
                  placeholder="Enter the Club Prismic UID e.g. london-quidditch-club"
                  my={3}
                  error={errors.slug}
                />
              )}
            />

            {errors.slug && (
              <InlineError marginBottom={3}>{errors.slug.message}</InlineError>
            )}

            <Label htmlFor="email">
              League <Required />
            </Label>

            <Controller
              control={control}
              name="league"
              render={({ field }) => (
                <Select
                  {...field}
                  id="league"
                  my={3}
                  placeholder="Select league the team plays in"
                  bg="white"
                  color="qukBlue"
                >
                  {LEAGUES.map((league) => (
                    <option key={league} value={league}>
                      {league}
                    </option>
                  ))}
                </Select>
              )}
            />

            {errors.league && (
              <InlineError marginBottom={3}>
                {errors.league.message}
              </InlineError>
            )}

            <Label htmlFor="active">
              Is the club active? <Required />
              <Controller
                control={control}
                name="active"
                render={({ field }) => (
                  <Switch
                    {...field}
                    isChecked={field.value}
                    id="active"
                    colorScheme="green"
                    ml={3}
                    my={3}
                    size="lg"
                  />
                )}
              />
            </Label>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting' : 'Create'}
            </Button>
          </Flex>
        </Grid>
      </form>

      {serverError && (
        <>
          <InlineError my={3}>{serverError}</InlineError>
        </>
      )}
    </Slice>
  );
};

export const getServerSideProps = async ({ req, res, params }) => {
  const auth = await isAuthorized(req, res, [CLUBS_READ, CLUBS_WRITE, EMT]);
  if (!auth) {
    return { props: {} };
  }

  const basePageProps = await getBasePageProps();

  return {
    props: basePageProps,
  };
};

export default Dashboard;
