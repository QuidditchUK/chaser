import { useState } from 'react';
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

import { buttonVariants } from 'components/prismic-wrapper';
import Input from 'components/input'; // DO NOT DYNAMIC IMPORT, BREAKS FORMS
import Textarea from 'components/textarea'; // DO NOT DYNAMIC IMPORT, BREAKS FORMS

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

const NATIONAL_TEAMS = ['England', 'Scotland', 'Wales'];
const POSITIONS = ['Keeper/Chaser', 'Beater', 'Seeker'];

const NationalTeamFormSchema = object().shape({
  first_team: string()
    .nullable()
    .required('Please select your first choice National Team.'),
  second_team: string().nullable(),
  third_team: string().nullable(),
  position: string().required('Please select your primary position.'),
  playstyle: string().required(
    'Please enter a short description of your playstyle.'
  ),
  years: number().required(
    'Please estimate how many years of active quidditch experience you have.'
  ),
  experience: string().required('Please summarise your quidditch experience.'),
});

const handleFormSubmit = async (values, setServerError, setServerSuccess) => {
  try {
    setServerError(null);
    setServerSuccess(null);

    // TODO: Update and test api endpoint for this form.
    await api.post('/contact/national', values);
    setServerSuccess(true);
  } catch (err) {
    setServerError(err?.response?.data?.error?.message);
  }
};

// TODO: Test this to recieving a data structure provided by the API.
const NationalTeamProfileForm = ({ profile = {} }) => {
  const [serverError, setServerError] = useState(null);
  const [serverSuccess, setServerSuccess] = useState(null);

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

  // TODO: Not sure exactly how the forms work regarding linking back to the user. But that needs to be handled here.
  return (
    <PrismicWrapper variant={variant}>
      <Heading as="h1" fontFamily="body" textAlign="center">
        National Team Profile
      </Heading>
      <p>
        Welcome to <b>your</b> National Team Profile. Use the form below to get
        on the radar of the best Managers and Coaches in the UK, and register
        your interest in playing for one of QuidditchUKs National Teams.
        <br />
        <i>
          You can check out our National Team policies{' '}
          <Link href="/about/documents-and-policies">here</Link>.
        </i>
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
                  <i>
                    {/* National Eligibility Criteria URL below points to the CMS, will need to be updated if the file is moved/changed. */}
                    You can check eligibility criteria{' '}
                    <Link href="https://chaser.cdn.prismic.io/chaser/13bf388d-a194-4b10-bda7-9f503dfd6f55_National+Team+Operational+Policy+-+2020.pdf">
                      here
                    </Link>
                    .
                  </i>
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
                  error={errors.playstyle}
                />

                {errors.years && (
                  <InlineError marginBottom={3}>
                    {errors.years.message}
                  </InlineError>
                )}

                <Label htmlFor="experience">
                  Summarise your quidditch experience. <Required />
                  <br />
                  <i>
                    Focus on high-level tournaments and matches that you have
                    been a part of, and your current best finishes.
                  </i>
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
    </PrismicWrapper>
  );
};

export default NationalTeamProfileForm;
