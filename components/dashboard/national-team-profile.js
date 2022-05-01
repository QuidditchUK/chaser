import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
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

import Input from 'components/formControls/input'; // DO NOT DYNAMIC IMPORT, BREAKS FORMS
import Textarea from 'components/formControls/textarea'; // DO NOT DYNAMIC IMPORT, BREAKS FORMS

const Label = dynamic(() => import('components/formControls/label'));
const Button = dynamic(() => import('components/shared/button'));
const Container = dynamic(() => import('components/layout/container'));
const Required = dynamic(() => import('components/formControls/required'));
const InlineError = dynamic(() =>
  import('components/shared/errors').then(({ InlineError }) => InlineError)
);

import { api } from 'modules/api';
import { rem } from 'styles/theme';

const NATIONAL_TEAMS = ['England', 'Scotland', 'Wales'];
const POSITIONS = ['Keeper/Chaser', 'Beater', 'Seeker'];

const NationalTeamFormSchema = object().shape({
  first_team: string().when('national_team_interest', {
    is: true,
    then: string()
      .nullable()
      .required('Please select your first choice National Team.'),
    otherwise: string().nullable(),
  }),
  second_team: string().nullable(),
  third_team: string().nullable(),
  position: string().when('national_team_interest', {
    is: true,
    then: string().nullable().required('Please select your primary position.'),
    otherwise: string().nullable(),
  }),
  playstyle: string().when('national_team_interest', {
    is: true,
    then: string()
      .nullable()
      .required('Please enter a short description of your playstyle.'),
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
    then: string()
      .nullable()
      .required('Please summarise your quidditch experience.'),
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

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = useForm({
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

  const watchInterest = watch('national_team_interest');

  return (
    <>
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

      <form
        onSubmit={handleSubmit((values) =>
          handleFormSubmit(values, setServerError, setServerSuccess)
        )}
      >
        <Grid gridTemplateColumns="1fr">
          <Label htmlFor="national_team_interest">
            Are you interested? <Required />
            <Controller
              control={control}
              name="national_team_interest"
              render={({ field }) => (
                <Switch
                  {...field}
                  isChecked={field.value}
                  id="national_team_interest"
                  colorScheme="green"
                  ml={3}
                  my={3}
                  size="lg"
                />
              )}
            />
          </Label>

          {watchInterest && (
            <>
              <Label htmlFor="team" mb="2">
                List the national teams that you are elligible for, and want to
                be considered for, in order of preference. <Required />
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

              <Controller
                control={control}
                name="first_team"
                render={({ field }) => (
                  <Select
                    {...field}
                    id="first_team"
                    marginBottom={3}
                    placeholder="First choice national team"
                    bg="white"
                    color="qukBlue"
                  >
                    {NATIONAL_TEAMS.map((team) => (
                      <option key={team} value={team}>
                        {team}
                      </option>
                    ))}
                  </Select>
                )}
              />

              {errors.first_team && (
                <InlineError marginBottom={3}>
                  {errors.first_team.message}
                </InlineError>
              )}

              <Controller
                control={control}
                name="second_team"
                render={({ field }) => (
                  <Select
                    {...field}
                    id="second_team"
                    placeholder="Second choice national team"
                    marginBottom={3}
                    bg="white"
                    color="qukBlue"
                  >
                    {NATIONAL_TEAMS.map((team) => (
                      <option key={team} value={team}>
                        {team}
                      </option>
                    ))}
                  </Select>
                )}
              />

              {errors.second_team && (
                <InlineError marginBottom={3}>
                  {errors.second_team.message}
                </InlineError>
              )}

              <Controller
                control={control}
                name="third_team"
                render={({ field }) => (
                  <Select
                    {...field}
                    id="third_team"
                    placeholder="Third choice national team"
                    marginBottom={3}
                    bg="white"
                    color="qukBlue"
                  >
                    {NATIONAL_TEAMS.map((team) => (
                      <option key={team} value={team}>
                        {team}
                      </option>
                    ))}
                  </Select>
                )}
              />

              {errors.third_team && (
                <InlineError marginBottom={3}>
                  {errors.third_team.message}
                </InlineError>
              )}

              <Label htmlFor="position">
                What is your primary position? <Required />
              </Label>

              <Controller
                control={control}
                name="position"
                render={({ field }) => (
                  <Select
                    {...field}
                    id="position"
                    placeholder="Select your primary position"
                    mt={2}
                    marginBottom={3}
                    bg="white"
                    color="qukBlue"
                  >
                    {POSITIONS.map((position) => (
                      <option key={position} value={position}>
                        {position}
                      </option>
                    ))}
                  </Select>
                )}
              />

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

              <Controller
                control={control}
                name="playstyle"
                render={({ field }) => (
                  <Textarea
                    {...field}
                    id="playstyle"
                    placeholder="Your playstyle"
                    my={3}
                    error={errors.playstyle}
                  />
                )}
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

              <Controller
                control={control}
                name="years"
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Years active"
                    my={3}
                    error={errors.years}
                    type="number"
                  />
                )}
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
                  Focus on high-level tournaments and matches that you have been
                  a part of, and your current best finishes.
                </em>
              </Label>
              <Controller
                control={control}
                name="experience"
                render={({ field }) => (
                  <Textarea
                    {...field}
                    id="experience"
                    placeholder="Playing experience"
                    my={3}
                    error={errors.experience}
                  />
                )}
              />

              {errors.experience && (
                <InlineError marginBottom={3}>
                  {errors.experience.message}
                </InlineError>
              )}
            </>
          )}

          <Button type="submit" disabled={isSubmitting}>
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
    </>
  );
};

export default NationalTeamProfileForm;
