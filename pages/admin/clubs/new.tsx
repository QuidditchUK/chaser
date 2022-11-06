import Router from 'next/router';
import Link from 'next/link';
import { object, string, bool } from 'yup';
import dynamic from 'next/dynamic';
import { Heading, Grid, Flex, Box } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import clubsService from 'services/clubs';
import Error from 'components/shared/errors';
import { CLUBS_READ, CLUBS_WRITE, EMT } from 'constants/scopes';
import Slice from 'components/shared/slice';

import InputV2 from 'components/formControls/inputV2';
import Select from 'components/formControls/select';
import Switch from 'components/formControls/switch';

import { isScoped_ServerProps } from 'modules/auth';
import { getBasePageProps } from 'modules/prismic';
import useTempPopup from 'hooks/useTempPopup';
import { GetServerSideProps } from 'next';

const Button = dynamic(() => import('components/shared/button'));

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
    const { data: club } = await clubsService.createClub({ data: values });

    Router.push(`/admin/clubs/${club.uuid}`);
  } catch (err) {
    setServerError(err?.response?.data?.error?.message);
  }
};
const CreateClub = () => {
  const [serverError, setServerError] = useTempPopup();

  const {
    register,
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
          <Flex direction="column" gridGap={3}>
            <InputV2
              label="Name"
              isRequired
              id="name"
              placeholder="Club name"
              error={errors?.name}
              {...register('name')}
            />

            <InputV2
              label="Email Address"
              isRequired
              id="email"
              placeholder="Club email address"
              error={errors?.email}
              {...register('email')}
            />

            <InputV2
              label="Prismic UID"
              isRequired
              id="slug"
              placeholder="Enter the Club Prismic UID e.g. london-quidditch-club"
              error={errors?.slug}
              {...register('slug')}
            />

            <Select
              label="League"
              isRequired
              id="league"
              placeholder="Select league the team plays in"
              options={LEAGUES.map((league) => ({
                value: league,
                label: league,
              }))}
              error={errors?.league}
              {...register('league')}
            />

            <Switch
              label="Is the club active?"
              id="active"
              size="lg"
              colorScheme="green"
              display="flex"
              alignItems="center"
              {...register('active')}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting' : 'Create'}
            </Button>
          </Flex>
        </Grid>
      </form>

      {serverError && <Error>{serverError}</Error>}
    </Slice>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const auth = isScoped_ServerProps(context, [CLUBS_READ, CLUBS_WRITE, EMT]);
  if (!auth) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }

  return {
    props: await getBasePageProps(),
  };
};

export default CreateClub;

CreateClub.auth = {
  skeleton: <Box />,
};
