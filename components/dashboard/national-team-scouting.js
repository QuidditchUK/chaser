import { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import dynamic from 'next/dynamic';

import { object, string, number } from 'yup';
import {
  Grid,
  Flex,
  Select,
  Heading,
  Text,
  Switch,
  Box,
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';

import { api } from 'modules/api';
import Input from 'components/formControls/input'; // DO NOT DYNAMIC IMPORT, BREAKS FORMS

const Slice = dynamic(() => import('components/shared/slice'));
const Label = dynamic(() => import('components/formControls/label'));
const Button = dynamic(() => import('components/shared/button'));
const Container = dynamic(() => import('components/layout/container'));
const Required = dynamic(() => import('components/formControls/required'));
const InlineError = dynamic(() =>
  import('components/shared/errors').then(({ InlineError }) => InlineError)
);

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

    await api.put('/users/scouting', values);
    setServerSuccess(true);
    resetForm({});
  } catch (err) {
    setServerError(err?.response?.data?.error?.message);
  }
};

const NationalTeamScoutingForm = ({ events = [] }) => {
  const [serverError, setServerError] = useState(null);
  const [serverSuccess, setServerSuccess] = useState(null);

  useEffect(() => {
    if (serverSuccess) {
      const timer = setTimeout(() => {
        setServerSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }

    return () => {};
  }, [serverSuccess]);

  const {
    control,
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

  if (events.length !== 0) {
    return (
      <Box bg="qukBlue" color="white">
        <Heading as="h1" fontFamily="body" textAlign="center">
          Apply to be scouted
        </Heading>
        <p>
          Use the following form to apply to be scouted at an upcoming event,
          and begin your journey onto a QuidditchUK National Team. Good luck!
        </p>
        <form
          onSubmit={handleSubmit((values) =>
            handleFormSubmit(values, reset, setServerError, setServerSuccess)
          )}
        >
          <Grid gridTemplateColumns="1fr">
            <Label htmlFor="profile_ready">
              Is your National Team Profile ready? <Required />
              <Controller
                control={control}
                name="profile_ready"
                render={({ field }) => (
                  <Switch
                    {...field}
                    isChecked={field.value}
                    id="profile_ready"
                    colorScheme="green"
                    ml={3}
                    my={3}
                    size="lg"
                  />
                )}
              />
            </Label>

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
                <Label htmlFor="event" mb="2">
                  Event to be scouted at? <Required />
                </Label>
                <Controller
                  control={control}
                  name="event"
                  render={({ field }) => (
                    <Select
                      {...field}
                      id="event"
                      placeholder="Choose event"
                      marginBottom={3}
                      bg="white"
                      color="qukBlue"
                    >
                      {events.map(({ data }) => (
                        <option key={data?.event_name} value={data?.event_name}>
                          {data?.event_name}
                        </option>
                      ))}
                    </Select>
                  )}
                />
                {errors.event && (
                  <InlineError marginBottom={3}>
                    {errors.event.message}
                  </InlineError>
                )}
                <Label htmlFor="number">
                  Playing number for the event? <Required />
                  <br />
                  <em>
                    This will help us identify you when watching your matches.
                  </em>
                </Label>
                <Controller
                  control={control}
                  name="number"
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      id="number"
                      defaultValues="0"
                      placeholder="#"
                      my={3}
                      error={errors.number}
                    />
                  )}
                />
                {errors.number && (
                  <InlineError marginBottom={3}>
                    {errors.number.message}
                  </InlineError>
                )}
                <Label htmlFor="team">
                  Team for the event?
                  <br />
                  <em>
                    If different to your regular season club, or if your club is
                    sending multiple teams.
                  </em>
                </Label>
                <Controller
                  control={control}
                  name="team"
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="team"
                      placeholder="Team for the event"
                      my={3}
                      error={errors.team}
                    />
                  )}
                />
                {errors.team && (
                  <InlineError marginBottom={3}>
                    {errors.team.message}
                  </InlineError>
                )}
                <Label htmlFor="pronouns">
                  What are your pronouns?
                  <br />
                  <em>
                    Please share if you are comfortable, it will help us address
                    you correctly in emails and reports related to this
                    application.
                  </em>
                </Label>
                <Controller
                  control={control}
                  name="pronouns"
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="pronouns"
                      placeholder="Your pronouns"
                      my={3}
                      error={errors.pronouns}
                    />
                  )}
                />
                {errors.pronouns && (
                  <InlineError marginBottom={3}>
                    {errors.pronouns.message}
                  </InlineError>
                )}
                <Button type="submit" variant={'white'} disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting' : 'Apply'}
                </Button>
              </>
            )}
          </Grid>
        </form>

        {serverError && (
          <>
            <InlineError my={3}>{serverError}</InlineError>
          </>
        )}

        {serverSuccess && (
          <Flex
            alignItems="center"
            bg="keeperGreen"
            px={4}
            py={1}
            mt={6}
            borderColor="keeperGreen"
            borderWidth="1px"
            borderStyle="solid"
            color="white"
            borderRadius="md"
          >
            <CheckIcon mr={3} /> <Text fontWeight="bold">Application sent</Text>
          </Flex>
        )}
      </Box>
    );
  } else {
    return (
      <Box bg="qukBlue" color="white">
        <Heading as="h1" fontFamily="body" textAlign="center">
          Apply to be scouted
        </Heading>
        There are currently no events available to apply to be scouted at.
        Scouting applications will open approximately 4 weeks before an event
        starts.
      </Box>
    );
  }
};

export default NationalTeamScoutingForm;
