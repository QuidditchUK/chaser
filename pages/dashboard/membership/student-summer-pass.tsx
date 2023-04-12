import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';

import parse from 'date-fns/parse';
import { Box, Grid, Heading, Text, Flex, useToast } from '@chakra-ui/react';
import { object, string, bool } from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import generateServerSideHeaders from 'modules/headers';
import { getBasePageProps } from 'modules/prismic';

import usersService from 'services/users';
import settingsService from 'services/settings';
import clubsService from 'services/clubs';
import productsService from 'services/products';
import { clubs as Club, system_settings as Settings } from '@prisma/client';
import Meta from 'components/shared/meta';
import Slice from 'components/shared/slice';
import Error from 'components/shared/errors';
import Content from 'components/shared/content';
import Button from 'components/shared/button';
import Select from 'components/formControls/select';
import Checkbox from 'components/formControls/checkbox';
import PrismicClubCard from 'components/prismic/club-card';

import useMe from 'hooks/useMe';
import useResponse from 'hooks/useResponse';
import { useRouter } from 'next/router';

const SelectClubSchema = object().shape({
  club_uuid: string().nullable().required('Required'),
  confirm: bool().oneOf(
    [true],
    'Please confirm that you have read the disclaimer'
  ),
});

function StudentSummerPass({
  clubs = [],
  settings,
}: {
  clubs: Club[];
  settings: Settings;
}) {
  const { push } = useRouter();
  const { data: user, refetch } = useMe();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<{ club_uuid: string; confirm: boolean }>({
    resolver: yupResolver(SelectClubSchema),
    defaultValues: {
      club_uuid: undefined,
      confirm: false,
    },
  });

  const {
    mutate: selectClub,
    error,
    isLoading,
  } = useResponse({
    queryFn: usersService.studentSummerPass,
    onSuccess: () => {
      toast({
        title: 'Student Summer Pass activated',
        description: `Your Student Summer Pass with ${selectedClub.name} has been activated`,
        status: 'success',
        duration: 5000,
        position: 'top',
        variant: 'left-accent',
        isClosable: true,
      });
      push('/dashboard');
    },
  });

  const communityClubs = clubs.filter((club) => club.league === 'Community');

  const [selectedClub, setSelectedClub] = useState<Club>(null);
  const currentSelectedClubUuid = watch('club_uuid', null);

  useEffect(() => {
    if (selectedClub?.uuid !== currentSelectedClubUuid) {
      setSelectedClub(
        communityClubs.find(({ uuid }) => uuid === currentSelectedClubUuid)
      );
    }
  }, [selectedClub, setSelectedClub, currentSelectedClubUuid, communityClubs]);

  return (
    <>
      <Meta
        description="Sign in to QuadballUK to manage your QuadballUK Membership, Account details and more"
        subTitle="Student Summer Pass"
      />
      <Slice>
        <Grid
          gridTemplateColumns={{ base: '1fr', md: '2fr 1fr' }}
          gridGap={{ base: 4, md: 9 }}
        >
          <Box
            bg="white"
            py={4}
            px={{ base: 4, sm: 8, md: 9 }}
            borderRadius="md"
          >
            <Heading as="h2" fontFamily="body" color="qukBlue" fontSize="3xl">
              Student Summer Pass
            </Heading>

            <Content>
              <Text>
                The <strong>Student Summer Pass</strong> allows current students
                who primarily play for their University club to join a Community
                club and play in the Community League.
              </Text>
              <Text>
                Once the Community League ends the player returns to their
                University club and are eligible to play for that University
                club in the University League, as well as at National and
                European championships.
              </Text>
              <Text>
                The <strong>Student Summer Pass</strong> is only availble to
                current students playing for a University team in the same
                season. Graduating players should instead [link-to]transfer to
                their desired club.
              </Text>
              <Text>
                Please select your <strong>Student Summer Pass</strong> club
                below. Before confirming, please double check that you have
                selected the correct club and that the club know you are joining
                them this competitive season.
              </Text>
              <Text>
                Once you have submitted your club you will not be able to undo
                it, and any changes will have to be requested via the Clubs
                Director at QuadballUK.
              </Text>
            </Content>

            <form
              onSubmit={handleSubmit((values) =>
                selectClub({ data: { club_uuid: values.club_uuid } })
              )}
            >
              <Grid gridTemplateColumns="1fr" mt={5} gridGap={3}>
                <Select
                  label="Select your Student Summer Pass club"
                  isRequired={true}
                  id="club_uuid"
                  placeholder="Select a club"
                  options={communityClubs?.map((club) => ({
                    value: club.uuid,
                    label: club.name,
                  }))}
                  error={errors.club_uuid}
                  {...register('club_uuid')}
                />

                <Checkbox
                  id="confirm"
                  {...register('confirm')}
                  size="md"
                  error={errors?.confirm}
                  isRequired={true}
                >
                  By checking this box I acknowledge that I have read the above
                  disclaimer and I intend for{' '}
                  <strong>{selectedClub?.name}</strong> to be my Summer Student
                  Pass club for the 2023/2024 Community League.
                </Checkbox>

                <Button
                  mt="2"
                  type="submit"
                  variant="green"
                  disabled={isLoading}
                >
                  {isLoading ? 'Submitting' : 'Select my club'}
                </Button>
              </Grid>
            </form>

            {error && <Error>{error}</Error>}
          </Box>

          {selectedClub && (
            <Flex flexDirection="column" key={selectedClub?.uuid}>
              <PrismicClubCard uid={selectedClub?.slug} isStudentSummerPass />
            </Flex>
          )}
        </Grid>
      </Slice>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  // TODO: Remove on release of Student Summer Pass
  return {
    redirect: {
      destination: '/dashboard/membership/manage',
      permanent: false,
    },
  };

  // const headers = generateServerSideHeaders(req);
  // const { data: products } = await productsService.getUserProducts({ headers });

  // if (
  //   !products.length ||
  //   !products.filter(
  //     (product) =>
  //       new Date() < parse(product?.metadata?.expires, 'dd-MM-yyyy', new Date())
  //   ).length
  // ) {
  //   return {
  //     redirect: {
  //       destination: '/dashboard/membership/manage',
  //       permanent: false,
  //     },
  //   };
  // }

  // const [{ data: clubs }, { data: settings }, basePageProps] =
  //   await Promise.all([
  //     clubsService.getPublicClubs(),
  //     settingsService.getSettings(),
  //     getBasePageProps(),
  //   ]);

  // return {
  //   props: {
  //     clubs,
  //     settings,
  //     ...basePageProps,
  //   },
  // };
};

export default StudentSummerPass;

StudentSummerPass.auth = {
  skeleton: <Box />,
};
