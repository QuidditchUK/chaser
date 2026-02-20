import Router from 'next/router';
import { object, string, date, number } from 'yup';
import dynamic from 'next/dynamic';
import { Grid, Flex, Box } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import tournamentsService from 'services/tournaments';
import Error from 'components/shared/errors';
import { CLUBS_READ, CLUBS_WRITE, EMT } from 'constants/scopes';
import Slice from 'components/shared/slice';

import InputV2 from 'components/formControls/inputV2';
import Select from 'components/formControls/select';
import DateInput from 'components/formControls/dateInput';
import TextareaV2 from 'components/formControls/textareaV2';

import { isScoped_ServerProps } from 'modules/auth';
import { getBasePageProps } from 'modules/prismic';
import useTempPopup from 'hooks/useTempPopup';
import { GetServerSideProps } from 'next';
import HeadingWithBreadcrumbs from 'components/shared/HeadingWithBreadcrumbs';
import { DateTime } from 'luxon';

const Button = dynamic(() => import('components/shared/button'));

const CreateTournamentSchema = object().shape({
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

const handleCreateSubmit = async (values, setServerError) => {
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
    setServerError(null);
    const { data: tournament } = await tournamentsService.createTournament({
      data: mappedValues,
    });

    Router.push(`/admin/tournaments/${tournament.uuid}`);
  } catch (err) {
    setServerError(err?.response?.data?.error?.message);
  }
};

const CreateTournament = () => {
  const [serverError, setServerError] = useTempPopup();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(CreateTournamentSchema),
    defaultValues: {
      name: '',
      location: '',
      description: '',
      'start-day': null,
      'start-month': null,
      'start-year': null,
      'end-day': null,
      'end-month': null,
      'end-year': null,
      'registrationStart-day': null,
      'registrationStart-month': null,
      'registrationStart-year': null,
      'registrationEnd-day': null,
      'registrationEnd-month': null,
      'registrationEnd-year': null,
    },
  });

  return (
    <Slice>
      <HeadingWithBreadcrumbs
        breadcrumbs={[
          { link: '/admin', title: 'Dashboard' },
          { link: '/admin/tournaments', title: 'Tournaments' },
        ]}
        heading="New Tournament"
      />
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

export default CreateTournament;

CreateTournament.auth = {
  skeleton: <Box />,
};
