import React, { useState } from 'react';
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
} from 'formik';
import * as Yup from 'yup';
import get from 'just-safe-get';
import styled from 'styled-components';
import { space } from 'styled-system';
import { Grid, Box } from 'components/layout';
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

const NATIONAL_TEAMS = [
  'UK',
  'Scotland',
  'Wales',
];

const Select = styled.select`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.body};
  padding: 0;
  ${space};
`;

const NationalTeamFormSchema = Yup.object().shape({
  name: Yup.string().required('Please enter your name'),
  email: Yup.string().email('Invalid email address').required('Please enter a valid email address'),
  club: Yup.string().required('Please enter the club you currently play for'),
  team: Yup.string().nullable().required('Please select what National Team you would like to be considered for'),
  position: Yup.string().required('Please list the positions you play'),
  tournament: Yup.string().required('Please enter the next tournament you will be at'),
});

const handleSubmit = async (values, setSubmitting, resetForm, setServerError, setServerSuccess) => {
  try {
    setServerError(null);
    setServerSuccess(null);

    await api.post('/contact/national', values);

    setSubmitting(false);
    setServerSuccess(true);
    resetForm({});
  } catch (err) {
    setServerError(err?.response?.data?.error?.message);
    setSubmitting(false);
  }
};

const NationalTeamForm = (rawData) => {
  const [serverError, setServerError] = useState(null);
  const [serverSuccess, setServerSuccess] = useState(null);

  const data = {
    variant: get(rawData, 'primary.variant'),
  };

  return (
    <PrismicWrapper variant={data.variant}>
      <Heading as="h1" isBody textAlign="center">Register your interest for a National Team</Heading>
      <Container maxWidth={rem(500)} paddingBottom={4}>
        <Formik
          initialValues={{
            name: '',
            emai: '',
            club: '',
            team: null,
            position: '',
            tournament: '',
          }}
          onSubmit={(values, { setSubmitting, resetForm }) => handleSubmit(values, setSubmitting, resetForm, setServerError, setServerSuccess)}
          validationSchema={NationalTeamFormSchema}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <Grid
                gridTemplateColumns="1fr"
              >
                <Label htmlFor="name">
                  Your name <Required />
                </Label>

                <Field
                  id="name"
                  name="name"
                  placeholder="Your name"
                  as={Input}
                  my={3}
                  error={errors.name && touched.name}
                />

                <ErrorMessage name="name" component={InlineError} marginBottom={3} />

                <Label htmlFor="email">
                  Your email <Required />
                </Label>

                <Field
                  name="email"
                  placeholder="Your email address"
                  as={Input}
                  my={3}
                  error={errors.email && touched.email}
                />

                <ErrorMessage name="email" component={InlineError} marginBottom={3} />

                <Label htmlFor="club">
                  Club <Required />
                </Label>

                <Field
                  name="club"
                  placeholder="The club you currently play for"
                  as={Input}
                  my={3}
                  error={errors.club && touched.club}
                />

                <ErrorMessage name="club" component={InlineError} marginBottom={3} />

                <Label htmlFor="team" mb="2">
                  Team to be considered for <Required />
                </Label>

                <Field
                  id="team"
                  name="team"
                  as={Select}
                  marginBottom={3}
                >
                  <option disabled selected value>Select a national team</option>
                  {NATIONAL_TEAMS.map((team) => (<option key={team} value={team}>{team}</option>))}
                </Field>

                <ErrorMessage name="team" component={InlineError} marginBottom={3} />

                <Label htmlFor="position">
                  Position <Required />
                </Label>

                <Field
                  name="position"
                  placeholder="List the positions you play"
                  as={Input}
                  my={3}
                  error={errors.position && touched.position}
                />

                <ErrorMessage name="position" component={InlineError} marginBottom={3} />

                <Label htmlFor="tournament">
                  Tournament you will next play at <Required />
                </Label>

                <Field
                  name="tournament"
                  placeholder="Tournament"
                  as={Input}
                  my={3}
                  error={errors.tournament && touched.tournament}
                />

                <ErrorMessage name="tournament" component={InlineError} marginBottom={3} />

              </Grid>

              <Button type="submit" variant={buttonVariants[data.variant]} disabled={isSubmitting}>{isSubmitting ? 'Submitting' : 'Apply'}</Button>
            </Form>
          )}
        </Formik>

        {serverError && (
          <>
            <InlineError my={3}>{serverError}</InlineError>
          </>
        )}

        {serverSuccess && (
          <Box bg="keeperGreen" px="4" py="2" mt="6" borderColor="keeperGreen" borderWidth="1px" borderStyle="solid" color="white" borderRadius={0}>
            <Content>Application sent</Content>
          </Box>
        )}
      </Container>
    </PrismicWrapper>
  );
};

export default NationalTeamForm;
