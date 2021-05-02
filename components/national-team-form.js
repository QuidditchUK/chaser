import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import dynamic from 'next/dynamic';

import { object, string } from 'yup';
import get from 'just-safe-get';
import { Grid, Flex, Select, Heading, Text } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/react';

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

const NATIONAL_TEAMS = ['England', 'Scotland', 'Wales'];

const NationalTeamFormSchema = object().shape({
  name: string().required('Please enter your name'),
  email: string()
    .email('Invalid email address')
    .required('Please enter a valid email address'),
  club: string().required('Please enter the club you currently play for'),
  team: string()
    .nullable()
    .required(
      'Please select what National Team you would like to be considered for'
    ),
  position: string().required('Please list the positions you play'),
  tournament: string().required(
    'Please enter the next tournament you will be at'
  ),
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

    await api.post('/contact/national', values);

    setServerSuccess(true);
    resetForm({
      name: '',
      email: '',
      club: '',
      team: null,
      position: '',
      tournament: '',
    });
  } catch (err) {
    setServerError(err?.response?.data?.error?.message);
  }
};

const NationalTeamForm = (rawData) => {
  const [serverError, setServerError] = useState(null);
  const [serverSuccess, setServerSuccess] = useState(null);

  const { register, handleSubmit, errors, reset, formState } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(NationalTeamFormSchema),
    defaultValues: {
      name: '',
      email: '',
      club: '',
      team: null,
      position: '',
      tournament: '',
    },
  });

  const { isSubmitting } = formState;

  const variant = get(rawData, 'primary.variant');

  return (
    <PrismicWrapper variant={variant}>
      <Heading as="h1" fontFamily="body" textAlign="center">
        Register your interest for a National Team
      </Heading>
      <Container maxWidth={rem(500)} paddingBottom={4}>
        <form
          onSubmit={handleSubmit((values) =>
            handleFormSubmit(values, reset, setServerError, setServerSuccess)
          )}
        >
          <Grid gridTemplateColumns="1fr">
            <Label htmlFor="name">
              Your name <Required />
            </Label>

            <Input
              id="name"
              name="name"
              placeholder="Your name"
              ref={register}
              my={3}
              error={errors.name}
            />

            {errors.name && (
              <InlineError marginBottom={3}>{errors.name.message}</InlineError>
            )}

            <Label htmlFor="email">
              Your email <Required />
            </Label>

            <Input
              name="email"
              placeholder="Your email address"
              ref={register}
              my={3}
              error={errors.email}
            />

            {errors.email && (
              <InlineError marginBottom={3}>{errors.email.message}</InlineError>
            )}

            <Label htmlFor="club">
              Club <Required />
            </Label>

            <Input
              name="club"
              placeholder="The club you currently play for"
              ref={register}
              my={3}
              error={errors.club}
            />

            {errors.club && (
              <InlineError marginBottom={3}>{errors.club.message}</InlineError>
            )}

            <Label htmlFor="team" mb="2">
              Team to be considered for <Required />
            </Label>

            <Select
              id="team"
              name="team"
              ref={register}
              marginBottom={3}
              bg="white"
              color="qukBlue"
            >
              <option disabled value>
                Select a national team
              </option>
              {NATIONAL_TEAMS.map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </Select>

            {errors.team && (
              <InlineError marginBottom={3}>{errors.team.message}</InlineError>
            )}

            <Label htmlFor="position">
              Position <Required />
            </Label>

            <Input
              name="position"
              placeholder="List the positions you play"
              ref={register}
              my={3}
              error={errors.position}
            />

            {errors.position && (
              <InlineError marginBottom={3}>
                {errors.position.message}
              </InlineError>
            )}

            <Label htmlFor="tournament">
              Tournament you will next play at <Required />
            </Label>

            <Input
              name="tournament"
              placeholder="Tournament"
              ref={register}
              my={3}
              error={errors.tournament}
            />

            {errors.tournament && (
              <InlineError marginBottom={3}>
                {errors.tournament.message}
              </InlineError>
            )}
          </Grid>

          <Button
            type="submit"
            variant={buttonVariants[variant]}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting' : 'Apply'}
          </Button>
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
      </Container>
    </PrismicWrapper>
  );
};

export default NationalTeamForm;
