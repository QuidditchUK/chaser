import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import * as Yup from 'yup';
import get from 'just-safe-get';
import styled from '@emotion/styled';
import { space } from 'styled-system';
import { Grid, Box } from 'components';
import Input from 'components/input';
import Label from 'components/label';
import Button from 'components/button';
import PrismicWrapper, { buttonVariants } from 'components/prismic-wrapper';
import Container from 'components/container';
import Heading from 'components/heading';
import Content from 'components/content';
import Required from 'components/required';
import { InlineError } from 'components/errors';
import { api } from 'modules/api';
import { rem } from 'styles/theme';

const NATIONAL_TEAMS = ['UK', 'Scotland', 'Wales'];

const Select = styled.select`
  color: ${({ theme }) => theme.colors.qukBlue};
  font-size: ${({ theme }) => theme.fontSizes.body};
  padding: 0;
  ${space};
`;

const NationalTeamFormSchema = Yup.object().shape({
  name: Yup.string().required('Please enter your name'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Please enter a valid email address'),
  club: Yup.string().required('Please enter the club you currently play for'),
  team: Yup.string()
    .nullable()
    .required(
      'Please select what National Team you would like to be considered for'
    ),
  position: Yup.string().required('Please list the positions you play'),
  tournament: Yup.string().required(
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
    resetForm({});
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

  const data = {
    variant: get(rawData, 'primary.variant'),
  };

  return (
    <PrismicWrapper variant={data.variant}>
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

            <Select id="team" name="team" ref={register} marginBottom={3}>
              <option disabled selected value>
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
            variant={buttonVariants[data.variant]}
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
          <Box
            bg="keeperGreen"
            px="4"
            py="2"
            mt="6"
            borderColor="keeperGreen"
            borderWidth="1px"
            borderStyle="solid"
            color="white"
            borderRadius="sm"
          >
            <Content>Application sent</Content>
          </Box>
        )}
      </Container>
    </PrismicWrapper>
  );
};

export default NationalTeamForm;
