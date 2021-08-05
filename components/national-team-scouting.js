import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import dynamic from 'next/dynamic';

import { object, string, number } from 'yup';
import { Grid, Flex, Select, Heading, Text, Switch } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';

import { buttonVariants } from 'components/prismic-wrapper';
import Input from 'components/input'; // DO NOT DYNAMIC IMPORT, BREAKS FORMS

const PrismicWrapper = dynamic(() => import('components/prismic-wrapper'));
const Label = dynamic(() => import('components/label'));
const Button = dynamic(() => import('components/button'));
const Container = dynamic(() => import('components/container'));
const Required = dynamic(() => import('components/required'));
const InlineError = dynamic(() =>
  import('components/errors').then(({ InlineError }) => InlineError)
);

import { api } from 'modules/api';
import { rem } from 'styles/theme';

const NationalTeamScoutingFormSchema = object().shape({
  event: string()
    .nullable()
    .required(
      'Please select the event you would like to apply to be scouted at.'
    ),
  number: number()
    .nullable()
    .required('Please enter the number you will be playing in at the event.'),
  team: string().nullable(),
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

    // TODO: Create and test new api endpoint for this form.
    await api.post('/users/scouting', values);
    setServerSuccess(true);
    resetForm({});
  } catch (err) {
    setServerError(err?.response?.data?.error?.message);
  }
};

const NationalTeamScoutingForm = ({ events = [] }) => {
  const [serverError, setServerError] = useState(null);
  const [serverSuccess, setServerSuccess] = useState(null);

  const { register, handleSubmit, errors, reset, watch, formState } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(NationalTeamScoutingFormSchema),
    defaultValues: {
      profile_ready: false,
      event: null,
      number: null,
      team: '',
    },
  });

  const { isSubmitting } = formState;

  const watchProfile = watch('profile_ready');
  const variant = 'primary';

  if (events.length !== 0) {
    return (
      <PrismicWrapper variant={variant}>
        <Heading as="h1" fontFamily="body" textAlign="center">
          Apply to be scouted
        </Heading>
        <p>
          Use the following form to apply to be scouted at an upcoming event,
          and begin your journey onto a QuidditchUK National Team. Good luck!
        </p>
        <Container maxWidth={rem(500)} paddingBottom={4}>
          <form
            onSubmit={handleSubmit((values) =>
              handleFormSubmit(values, reset, setServerError, setServerSuccess)
            )}
          >
            <Grid gridTemplateColumns="1fr">
              <Label htmlFor="profile_ready">
                Is your National Team Profile ready? <Required />
                <Switch
                  name="profile_ready"
                  ref={register}
                  colorScheme="green"
                  ml={3}
                  my={3}
                  size="lg"
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
                  <Label htmlFor="team" mb="2">
                    Event to be scouted at? <Required />
                  </Label>
                  <Select
                    id="event"
                    name="event"
                    ref={register}
                    marginBottom={3}
                    bg="white"
                    color="qukBlue"
                  >
                    <option disabled value>
                      Choose event
                    </option>
                    {events.map((event) => (
                      <option key={event} value={event}>
                        {event}
                      </option>
                    ))}
                  </Select>
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
                  <Input
                    name="number"
                    placeholder="#"
                    ref={register}
                    my={3}
                    error={errors.number}
                  />
                  {errors.number && (
                    <InlineError marginBottom={3}>
                      {errors.number.message}
                    </InlineError>
                  )}
                  <Label htmlFor="team">
                    Team for the event?
                    <br />
                    <em>If different to your regular season team.</em>
                  </Label>
                  <Input
                    name="team"
                    placeholder="Team for the event"
                    ref={register}
                    my={3}
                    error={errors.team}
                  />
                  {errors.team && (
                    <InlineError marginBottom={3}>
                      {errors.team.message}
                    </InlineError>
                  )}
                  <Button
                    type="submit"
                    variant={buttonVariants[variant]}
                    disabled={isSubmitting}
                  >
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
              <CheckIcon mr={3} />{' '}
              <Text fontWeight="bold">Application sent</Text>
            </Flex>
          )}
        </Container>
      </PrismicWrapper>
    );
  } else {
    return (
      <PrismicWrapper variant={variant}>
        <Heading as="h1" fontFamily="body" textAlign="center">
          Apply to be scouted
        </Heading>
        There are currently no events available to apply to be scouted at.
        Scouting applications will open approximately 4 weeks before an event
        starts.
      </PrismicWrapper>
    );
  }
};

export default NationalTeamScoutingForm;
