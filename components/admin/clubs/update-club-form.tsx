import { clubs as Club } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string, bool } from 'yup';
import { Grid, Flex } from '@chakra-ui/react';

import Success from 'components/formControls/success';
import Error from 'components/shared/errors';
import PrismicClubCard from 'components/prismic/club-card';
import clubsService from 'services/clubs';

import InputV2 from 'components/formControls/inputV2';
import Select from 'components/formControls/select';
import Switch from 'components/formControls/switch';
import Button from 'components/shared/button';
import useTempPopup from 'hooks/useTempPopup';

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
  setServerSuccess,
  refetch
) => {
  try {
    setServerError(null);
    setServerSuccess(null);

    await clubsService.updateClub({ club_uuid: uuid, data: values });

    setServerSuccess(true);
    refetch();
  } catch (err) {
    setServerError(err?.response?.data?.error?.message);
  }
};

const UpdateClubForm = ({
  club,
  refetch,
}: {
  club: Club;
  refetch: () => void;
}) => {
  const [serverError, setServerError] = useTempPopup();
  const [serverSuccess, setServerSuccess] = useTempPopup();

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
    <form
      onSubmit={handleSubmit((values) =>
        handleEditSubmit(
          club?.uuid,
          values,
          setServerError,
          setServerSuccess,
          refetch
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
  );
};

export default UpdateClubForm;
