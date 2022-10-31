import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import dynamic from 'next/dynamic';

import { object, string, number } from 'yup';
import { Grid, Heading, Box } from '@chakra-ui/react';

import Switch from 'components/formControls/switch';

import useTempPopup from 'hooks/useTempPopup';
import usersService from 'services/users';
import Select from 'components/formControls/select';
import InputV2 from 'components/formControls/inputV2';
import Success from 'components/formControls/success';
import Error from 'components/shared/errors';

const Button = dynamic(() => import('components/shared/button'));

const NationalTeamScoutingFormSchema = object().shape({
  event: string()
    .nullable()
    .required(
      'Please select the event you would like to apply to be scouted at.'
    ),
  number: number()
    .transform((currentValue, originalValue) => {
      return originalValue === '' ? null : currentValue;
    })
    .nullable()
    .required('Please enter the number you will be playing in at the event.'),
  team: string().nullable(),
  pronouns: string().nullable(),
});

const handleFormSubmit = async (
  values,
  resetForm,
  setServerError,
  setServerSuccess
) => {
  try {
    setServerError(null);
    setServerSuccess(null);

    await usersService.scoutingRequest({ data: values });
    setServerSuccess(true);
    resetForm({});
  } catch (err) {
    setServerError(err?.response?.data?.error?.message);
  }
};

const NationalTeamScoutingForm = ({ events = [] }) => {
  const [serverError, setServerError] = useTempPopup();
  const [serverSuccess, setServerSuccess] = useTempPopup();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting, errors },
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(NationalTeamScoutingFormSchema),
    defaultValues: {
      profile_ready: false,
      event: null,
      number: null,
      team: '',
      pronouns: '',
    },
  });

  const watchProfile = watch('profile_ready');

  return (
    <Box bg="qukBlue" color="white">
      <Heading as="h1" fontFamily="body" textAlign="center">
        Apply to be scouted
      </Heading>

      {events?.length !== 0 ? (
        <>
          <p>
            Use the following form to apply to be scouted at an upcoming event,
            and begin your journey onto a QuadballUK National Team. Good luck!
          </p>
          <form
            onSubmit={handleSubmit((values) =>
              handleFormSubmit(values, reset, setServerError, setServerSuccess)
            )}
          >
            <Grid gridTemplateColumns="1fr" gridGap={3}>
              <Switch
                label="Is your National Team Profile ready?"
                isRequired
                id="profile_ready"
                size="lg"
                colorScheme="green"
                display="flex"
                alignItems="center"
                color="white"
                {...register('profile_ready')}
              />

              {watchProfile && (
                <>
                  Please note the following before continuing:
                  <ul>
                    <li>
                      Scouting applications will open 4 weeks before an event
                      starts, and stay open for 2 weeks.
                    </li>
                    <li>
                      You will hear if your application to be scouted is
                      successful approximately 1 week before the start of the
                      event.
                    </li>
                    <li>
                      Every player who gets scouted will recieve personalised
                      feedback from one of our scouts.
                    </li>
                    <li>
                      Do not apply to be scouted for more than 1 tournament at a
                      time - wait for feedback on a previous application before
                      re-applying.
                    </li>
                  </ul>
                  <Select
                    id="event"
                    label="Event to be scouted at?"
                    isRequired
                    options={events.map(({ data }) => ({
                      value: data?.event_name,
                      label: data?.event_name,
                    }))}
                    placeholder="Choose event"
                    error={errors?.event}
                    color="white"
                    {...register('event')}
                  />
                  <InputV2
                    label="Playing number for the event?"
                    isRequired
                    type="number"
                    id="number"
                    {...register('number')}
                    placeholder="#"
                    error={errors?.number}
                    color="white"
                  />
                  <InputV2
                    label="Team for the event?"
                    id="team"
                    {...register('team')}
                    placeholder="Team for the event"
                    error={errors?.team}
                    color="white"
                  />
                  <InputV2
                    label={
                      <>
                        What are your pronouns?
                        <br />
                        <em>
                          Please share if you are comfortable, it will help us
                          address you correctly in emails and reports related to
                          this application.
                        </em>
                      </>
                    }
                    id="pronouns"
                    {...register('pronouns')}
                    placeholder="Your pronouns"
                    error={errors?.pronouns}
                    color="white"
                  />
                  <Button
                    type="submit"
                    variant={'white'}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting' : 'Apply'}
                  </Button>
                </>
              )}
            </Grid>
          </form>

          {serverError && <Error>{serverError}</Error>}
          {serverSuccess && <Success>Application sent</Success>}
        </>
      ) : (
        <>
          There are currently no events available to apply to be scouted at.
          Scouting applications will open approximately 4 weeks before an event
          starts.
        </>
      )}
    </Box>
  );
};

export default NationalTeamScoutingForm;
