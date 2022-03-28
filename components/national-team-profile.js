import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
  Link,
} from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';

import { buttonVariants } from 'components/slice';
import Input from 'components/input'; // DO NOT DYNAMIC IMPORT, BREAKS FORMS
import Textarea from 'components/textarea'; // DO NOT DYNAMIC IMPORT, BREAKS FORMS

const Slice = dynamic(() => import('components/slice'));
const Label = dynamic(() => import('components/label'));
const Button = dynamic(() => import('components/button'));
const Container = dynamic(() => import('components/container'));
const Required = dynamic(() => import('components/required'));
const InlineError = dynamic(() =>
  import('components/errors').then(({ InlineError }) => InlineError)
);

import { api } from 'modules/api';
import { rem } from 'styles/theme';

const NATIONAL_TEAMS = ['England', 'Scotland', 'Wales'];
const POSITIONS = ['Keeper/Chaser', 'Beater', 'Seeker'];

const NationalTeamFormSchema = object().shape({
  first_team: string().when('national_team_interest', {
    is: true,
    then: string().required('Please select your first choice National Team.'),
    otherwise: string().nullable(),
  }),
  second_team: string().nullable(),
  third_team: string().nullable(),
  position: string().when('national_team_interest', {
    is: true,
    then: string().required('Please select your primary position.'),
    otherwise: string().nullable(),
  }),
  playstyle: string().when('national_team_interest', {
    is: true,
    then: string().required(
      'Please enter a short description of your playstyle.'
    ),
    otherwise: string().nullable(),
  }),
  years: number().when('national_team_interest', {
    is: true,
    then: number()
      .transform((currentValue, originalValue) => {
        return originalValue === '' ? null : currentValue;
      })
      .nullable()
      .required(
        'Please estimate how many years of active quidditch experience you have.'
      ),
    otherwise: number()
      .transform((currentValue, originalValue) => {
        return originalValue === '' ? null : currentValue;
      })
      .nullable(),
  }),
  experience: string().when('national_team_interest', {
    is: true,
    then: string().required('Please summarise your quidditch experience.'),
    otherwise: string().nullable(),
  }),
});

const handleFormSubmit = async (values, setServerError, setServerSuccess) => {
  try {
    setServerError(null);
    setServerSuccess(null);

    await api.put('/users/national', values);
    setServerSuccess(true);
  } catch (err) {
    setServerError(err?.response?.data?.error?.message);
  }
};

const NationalTeamProfileForm = ({ profile = {} }) => {
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

  const { register, handleSubmit, errors, watch, formState } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(NationalTeamFormSchema),
    defaultValues: {
      national_team_interest: profile.national_team_interest,
      first_team: profile.first_team,
      second_team: profile.second_team,
      third_team: profile.third_team,
      position: profile.position,
      playstyle: profile.playstyle,
      years: profile.years,
      experience: profile.experience,
    },
  });

  const { isSubmitting } = formState;

  const watchInterest = watch('national_team_interest');
  const variant = 'light';

  return (
    <Slice variant={variant}>
      <Heading as="h1" fontFamily="body" textAlign="center">
        National Team Profile
      </Heading>
      <p>
        Welcome to <strong>your</strong> National Team Profile. Use the form
        below to get on the radar of the best Managers and Coaches in the UK,
        and register your interest in playing for one of the QuidditchUK
        National Teams.
        <br />
        <em>
          You can check out our National Team policies{' '}
          <Link href="/about/documents-and-policies">here</Link>.
        </em>
      </p>
      <Container maxWidth={rem(500)} paddingBottom={4}>
        <form
          onSubmit={handleSubmit((values) =>
            handleFormSubmit(values, setServerError, setServerSuccess)
          )}
        >
          <Grid gridTemplateColumns="1fr">
            <Label htmlFor="national_team_interest">
              Are you interested? <Required />
              <Switch
                name="national_team_interest"
                ref={register}
                colorScheme="green"
                ml={3}
                my={3}
                size="lg"
              />
            </Label>

            {watchInterest && (
              <>
                <Label htmlFor="team" mb="2">
                  List the national teams that you are elligible for, and want
                  to be considered for, in order of preference. <Required />
                  <br />
                  <em>
                    {/* National Eligibility Criteria URL should point to the pdf file in the CMS when possible. */}
                    You can check eligibility criteria{' '}
                    <Link href="https://quidditchuk.org/about/documents-and-policies">
                      here
                    </Link>
                    .
                  </em>
                </Label>

                <Select
                  id="first_team"
                  name="first_team"
                  ref={register}
                  marginBottom={3}
                  bg="white"
                  color="qukBlue"
                >
                  <option disabled value>
                    First choice national team
                  </option>
                  {NATIONAL_TEAMS.map((team) => (
                    <option key={team} value={team}>
                      {team}
                    </option>
                  ))}
                </Select>

                {errors.first_team && (
                  <InlineError marginBottom={3}>
                    {errors.first_team.message}
                  </InlineError>
                )}

                <Select
                  id="second_team"
                  name="second_team"
                  ref={register}
                  marginBottom={3}
                  bg="white"
                  color="qukBlue"
                >
                  <option disabled value>
                    Second choice national team
                  </option>
                  <option value="">None</option>
                  {NATIONAL_TEAMS.map((team) => (
                    <option key={team} value={team}>
                      {team}
                    </option>
                  ))}
                </Select>

                {errors.second_team && (
                  <InlineError marginBottom={3}>
                    {errors.second_team.message}
                  </InlineError>
                )}

                <Select
                  id="third_team"
                  name="third_team"
                  ref={register}
                  marginBottom={3}
                  bg="white"
                  color="qukBlue"
                >
                  <option disabled value>
                    Third choice national team
                  </option>
                  <option value="">None</option>
                  {NATIONAL_TEAMS.map((team) => (
                    <option key={team} value={team}>
                      {team}
                    </option>
                  ))}
                </Select>

                {errors.third_team && (
                  <InlineError marginBottom={3}>
                    {errors.third_team.message}
                  </InlineError>
                )}

                <Label htmlFor="position">
                  What is your primary position? <Required />
                </Label>

                <Select
                  id="position"
                  name="position"
                  ref={register}
                  marginBottom={3}
                  bg="white"
                  color="qukBlue"
                >
                  <option disabled value>
                    Select your primary position
                  </option>
                  {POSITIONS.map((position) => (
                    <option key={position} value={position}>
                      {position}
                    </option>
                  ))}
                </Select>

                {errors.position && (
                  <InlineError marginBottom={3}>
                    {errors.position.message}
                  </InlineError>
                )}

                <Label htmlFor="playstyle">
                  Provide a brief description of your playstyle. <Required />
                  <br />
                  <em>
                    We are not looking for anything specific here, just tell us
                    about you and what makes you stand out on pitch.
                  </em>
                </Label>

                <Textarea
                  name="playstyle"
                  placeholder="Your playstyle"
                  ref={register}
                  my={3}
                  error={errors.playstyle}
                />

                {errors.playstyle && (
                  <InlineError marginBottom={3}>
                    {errors.playstyle.message}
                  </InlineError>
                )}

                <Label htmlFor="years">
                  How many years have you been actively playing quidditch?{' '}
                  <Required />
                </Label>

                <Input
                  name="years"
                  placeholder="Years active"
                  ref={register}
                  my={3}
                  error={errors.years}
                  type="number"
                />

                {errors.years && (
                  <InlineError marginBottom={3}>
                    {errors.years.message}
                  </InlineError>
                )}

                <Label htmlFor="experience">
                  Summarise your quidditch experience. <Required />
                  <br />
                  <em>
                    Focus on high-level tournaments and matches that you have
                    been a part of, and your current best finishes.
                  </em>
                </Label>

                <Textarea
                  name="experience"
                  placeholder="Playing experience"
                  ref={register}
                  my={3}
                  error={errors.experience}
                />

                {errors.experience && (
                  <InlineError marginBottom={3}>
                    {errors.experience.message}
                  </InlineError>
                )}
              </>
            )}

            <Button
              type="submit"
              variant={buttonVariants[variant]}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting' : 'Update'}
            </Button>
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
            <CheckIcon mr={3} /> <Text fontWeight="bold">Profile updated</Text>
          </Flex>
        )}
      </Container>
    </Slice>
  );
};

export default NationalTeamProfileForm;
