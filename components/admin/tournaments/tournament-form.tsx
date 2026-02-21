import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string, number } from 'yup';
import { Grid, Flex } from '@chakra-ui/react';
import { tournaments as PrismaTournaments } from '@prisma/client';

import Success from 'components/formControls/success';
import Error from 'components/shared/errors';
import clubsService from 'services/clubs';

import InputV2 from 'components/formControls/inputV2';
import useTempPopup from 'hooks/useTempPopup';
import DateInput from 'components/formControls/dateInput';
import TextareaV2 from 'components/formControls/textareaV2';
import dynamic from 'next/dynamic';
import { DateTime } from 'luxon';
import tournamentsService from 'services/tournaments';
import Router from 'next/router';

const Button = dynamic(() => import('components/shared/button'));

const TournamentSchema = object().shape({
  name: string().required('Please enter tournament name'),
  location: string().optional(),
  description: string().optional(),
  'start-day': number().optional(),
  'start-month': number().optional(),
  'start-year': number().optional(),
  'end-day': number().optional(),
  'end-month': number().optional(),
  'end-year': number().optional(),
  'registrationStart-day': number().optional(),
  'registrationStart-month': number().optional(),
  'registrationStart-year': number().optional(),
  'registrationEnd-day': number().required(
    'Please enter the last day players can register'
  ),
  'registrationEnd-month': number().required(
    'Please enter the last day players can register'
  ),
  'registrationEnd-year': number().required(
    'Please enter the last day players can register'
  ),
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

const TournamentForm = ({
  initialTournament,
}: {
  initialTournament?: PrismaTournaments;
}) => {
  const [serverSuccess, setServerSuccess] = useTempPopup(); // QQ use?
  const [serverError, setServerError] = useTempPopup();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(TournamentSchema),
    defaultValues: {
      name: initialTournament?.name || '',
      location: initialTournament?.location || '',
      description: initialTournament?.description || '',
      'start-day':
        DateTime.fromISO(initialTournament?.start as unknown as string).day ||
        null,
      'start-month':
        DateTime.fromISO(initialTournament?.start as unknown as string).month ||
        null,
      'start-year':
        DateTime.fromISO(initialTournament?.start as unknown as string).year ||
        null,
      'end-day':
        DateTime.fromISO(initialTournament?.end as unknown as string).day ||
        null,
      'end-month':
        DateTime.fromISO(initialTournament?.end as unknown as string).month ||
        null,
      'end-year':
        DateTime.fromISO(initialTournament?.end as unknown as string).year ||
        null,
      'registrationStart-day':
        DateTime.fromISO(
          initialTournament?.registrationStart as unknown as string
        ).day || null,
      'registrationStart-month':
        DateTime.fromISO(
          initialTournament?.registrationStart as unknown as string
        ).month || null,
      'registrationStart-year':
        DateTime.fromISO(
          initialTournament?.registrationStart as unknown as string
        ).year || null,
      'registrationEnd-day':
        DateTime.fromISO(
          initialTournament?.registrationEnd as unknown as string
        ).day || null,
      'registrationEnd-month':
        DateTime.fromISO(
          initialTournament?.registrationEnd as unknown as string
        ).month || null,
      'registrationEnd-year':
        DateTime.fromISO(
          initialTournament?.registrationEnd as unknown as string
        ).year || null,
    },
  });

  const handleActionSubmit = async (
    values,
    setServerError,
    setServerSuccess
  ) => {
    const mappedValues = {
      name: values.name,
      location: values.location,
      description: values.description,
      start: DateTime.fromObject({
        day: values['start-day'],
        month: values['start-month'],
        year: values['start-year'],
      }),
      end: DateTime.fromObject({
        day: values['end-day'],
        month: values['end-month'],
        year: values['end-year'],
      }),
      registrationStart: DateTime.fromObject({
        day: values['registrationStart-day'],
        month: values['registrationStart-month'],
        year: values['registrationStart-year'],
      }),
      registrationEnd: DateTime.fromObject({
        day: values['registrationEnd-day'],
        month: values['registrationEnd-month'],
        year: values['registrationEnd-year'],
      }),
    };
    try {
      if (!initialTournament) {
        setServerError(null);
        const { data: tournament } = await tournamentsService.createTournament({
          data: mappedValues,
        });

        Router.push(`/admin/tournaments/${tournament.uuid}`);
      } else {
        setServerError(null);
        await tournamentsService.updateTournament({
          tournament_uuid: initialTournament.uuid,
          data: mappedValues,
        });
        setServerSuccess(true);
      }
    } catch (err) {
      setServerError(err?.response?.data?.error?.message);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit((values) =>
          handleActionSubmit(values, setServerError, setServerSuccess)
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
              placeholder="Tournament name"
              error={errors?.name}
              {...register('name')}
            />

            <InputV2
              label="Location"
              id="location"
              placeholder="Tournament location"
              error={errors?.location}
              {...register('location')}
            />

            <TextareaV2
              label={
                <>
                  Provide tournament description
                  <br />
                  <em>Who is invited, gameplay, etc.</em>
                </>
              }
              id="description"
              placeholder="Tournament descriprion"
              error={errors?.description}
              {...register('description')}
            />

            <Grid gridTemplateColumns={{ base: '1fr 1fr' }} gridGap={4}>
              <DateInput
                label="Tournament start"
                id="start"
                error={errors?.['start-day']}
                name="start"
                register={register}
              />
              <DateInput
                label="Tournament end"
                id="end"
                error={errors?.['end-day']}
                name="end"
                register={register}
              />
            </Grid>

            <Grid gridTemplateColumns={{ base: '1fr 1fr' }} gridGap={4}>
              <DateInput
                label="Registration start"
                id="registrationStart"
                error={errors?.['registrationStart-day']}
                name="registrationStart"
                register={register}
              />
              <DateInput
                label="Registration end"
                id="registrationEnd"
                error={errors?.['registrationEnd-day']}
                name="registrationEnd"
                register={register}
              />
            </Grid>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? 'Submitting'
                : initialTournament
                ? 'Update'
                : 'Create'}
            </Button>
          </Flex>
        </Grid>
      </form>
      {serverError && <Error>{serverError}</Error>}

      {serverSuccess && <Success>Tournament updated</Success>}
    </>
  );
};

export default TournamentForm;
