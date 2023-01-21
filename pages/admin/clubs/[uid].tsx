import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { object, string, bool } from 'yup';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Heading, Grid, Flex, Box } from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import type { clubs as PrismaClub } from '@prisma/client';
import generateServerSideHeaders from 'modules/headers';

import { CLUBS_READ, CLUBS_WRITE, EMT } from 'constants/scopes';
import Slice from 'components/shared/slice';
import InputV2 from 'components/formControls/inputV2';
import Select from 'components/formControls/select';
import Switch from 'components/formControls/switch';
import Meta from 'components/shared/meta';

import ClubTeams from 'components/admin/clubs/club-teams';
import ClubMembers from 'components/admin/clubs/club-members';

import { isScoped_ServerProps } from 'modules/auth';
import { getBasePageProps } from 'modules/prismic';
import PrismicClubCard from 'components/prismic/club-card';
import clubsService from 'services/clubs';
import useTempPopup from 'hooks/useTempPopup';
import Success from 'components/formControls/success';
import Error from 'components/shared/errors';
import useCachedResponse from 'hooks/useCachedResponse';
import { getPlainScopes } from 'modules/scopes';
import useMe from 'hooks/useMe';

const Button = dynamic(() => import('components/shared/button'));

const LEAGUES = ['Community', 'University'];

const EditClubSchema = object().shape({
  email: string()
    .nullable()
    .email('Invalid email address')
    .required('Please enter a valid email address'),
  name: string().nullable().required('Please enter a Club Name'),
  slug: string().nullable().required('Please enter the Prismic Club UID'),
  active: bool().required(),
  league: string()
    .nullable()
    .required('Please select the league the club plays in'),
});

const handleEditSubmit = async (
  uuid,
  values,
  setServerError,
  setServerSuccess
) => {
  try {
    setServerError(null);
    setServerSuccess(null);

    await clubsService.updateClub({ club_uuid: uuid, data: values });

    setServerSuccess(true);
  } catch (err) {
    setServerError(err?.response?.data?.error?.message);
  }
};
const ClubPage = ({ club: initialData }: { club: PrismaClub }) => {
  const [serverError, setServerError] = useTempPopup();
  const [serverSuccess, setServerSuccess] = useTempPopup();
  const router = useRouter();
  const { data: user } = useMe();
  const userScopes = getPlainScopes(user.scopes);

  const { data: club, refetch } = useCachedResponse<PrismaClub>({
    queryKey: ['/clubs/', router.query.uid],
    queryFn: () => clubsService.getClub({ club_uuid: router.query.uid }),
    initialData,
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    watch,
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(EditClubSchema),
    defaultValues: {
      email: club?.email,
      name: club?.name,
      slug: club?.slug,
      active: club?.active || false,
      league: club?.league,
    },
  });

  const prismicClub = watch('slug');

  return (
    <>
      <Meta subTitle={club?.name} title="Clubs Admin Dashboard" />
      <Slice>
        <Heading
          as="h3"
          fontFamily="body"
          color="qukBlue"
          display="flex"
          alignItems="center"
        >
          <Link href="/admin">Dashboard</Link> <ChevronRightIcon />{' '}
          <Link href="/admin/clubs/">Clubs</Link> <ChevronRightIcon />{' '}
          {club?.name}
        </Heading>
        <form
          onSubmit={handleSubmit((values) =>
            handleEditSubmit(
              club?.uuid,
              values,
              setServerError,
              setServerSuccess
            )
          )}
        >
          <Grid
            bg="gray.100"
            p={4}
            borderRadius="lg"
            gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }}
            width="100%"
            gridColumnGap={4}
          >
            <Flex flexDirection="column" gridGap={3}>
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
                {isSubmitting ? 'Submitting' : 'Update'}
              </Button>
              {serverError && <Error>{serverError}</Error>}
              {serverSuccess && <Success>Club updated</Success>}
            </Flex>

            <Flex flexDirection="column">
              <PrismicClubCard uid={prismicClub} />
            </Flex>
          </Grid>
        </form>

        <ClubTeams club_uuid={club?.uuid} />
        <ClubMembers club={club} refetch={refetch} scopes={userScopes} />
      </Slice>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const auth = await isScoped_ServerProps(context, [
    CLUBS_READ,
    CLUBS_WRITE,
    EMT,
  ]);

  if (!auth) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }

  const headers = generateServerSideHeaders(context.req);

  const [{ data: club }, basePageProps] = await Promise.all([
    clubsService.getClub({ club_uuid: context.params?.uid, headers }),
    getBasePageProps(),
  ]);

  return {
    props: {
      club,
      ...basePageProps,
    },
  };
};

export default ClubPage;

ClubPage.auth = {
  skeleton: <Box />,
};
