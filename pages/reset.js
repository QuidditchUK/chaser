import React, { useState } from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import Meta from 'components/meta';
import Container from 'components/container';
import { Box, Grid, Flex } from 'components/layout';
import { Logo } from 'components/logo';
import Heading from 'components/heading';
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
} from 'formik';
import Input from 'components/input';
import Label from 'components/label';
import Button from 'components/button';
import { InlineError } from 'components/errors';
import { rem } from 'styles/theme';
import Content from 'components/content';
import { api } from 'modules/api';
import { setCookies, parseCookies } from 'modules/cookies';
import Required from 'components/required';

const Text = styled(Content)`
  a {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const logo = '/images/logo.png';

const ResetFormSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Must be at least 8 characters long')
    .required('Required'),
  confirm: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Required'),
});

const handleSubmit = async ({ confirm, ...formData }, setSubmitting, setServerError) => {
  try {
    setServerError(null);
    const { data } = await api.post('/users/reset', formData);

    setCookies('AUTHENTICATION_TOKEN', data.access_token);

    setSubmitting(false);
    Router.push('/dashboard');
  } catch (err) {
    setServerError(err?.response?.data?.error?.message);
    setSubmitting(false);
  }
};

const Page = () => {
  const [serverError, setServerError] = useState(null);
  const { query } = useRouter();
  const { token, uuid } = query;
  return (
    <>
      <Meta description="Forgot your password for QuidditchUK, request a reset here" subTitle="Forgot Sent" />
      <Box
        bg="greyLight"
        py={{ _: 4, l: 10 }}
        px={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}
      >
        <Container maxWidth={rem(500)}>
          <Flex justifyContent="center" alignItems="center"><Logo src={logo} alt="Quidditch UK" /></Flex>
          <Heading as="h1" isBody textAlign="center">Reset Password</Heading>

          <Formik
            initialValues={{
              password: '',
              confirm: '',
              token,
              uuid,
            }}

            onSubmit={(values, { setSubmitting }) => handleSubmit(values, setSubmitting, setServerError)}
            validationSchema={ResetFormSchema}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <Grid gridTemplateColumns="1fr">
                  <Label htmlFor="password">
                    New Password <Required />
                  </Label>
                  <Field
                    name="password"
                    placeholder="Password"
                    as={Input}
                    my={3}
                    type="password"
                    error={errors.password && touched.password}
                  />
                  <ErrorMessage name="password" component={InlineError} marginBottom={3} />

                  <Label htmlFor="confirm">
                    Confirm New Password <Required />
                  </Label>

                  <Field
                    name="confirm"
                    placeholder="Confirm your new password"
                    as={Input}
                    my={3}
                    type="password"
                    error={errors.confirm && touched.confirm}
                  />

                  <ErrorMessage name="confirm" component={InlineError} marginBottom={3} />
                </Grid>
                <Button type="submit" variant="green" disabled={isSubmitting}>{isSubmitting ? 'Submitting' : 'Reset password'}</Button>
              </Form>
            )}
          </Formik>

          {serverError && <InlineError my={3}>{serverError}</InlineError>}

          <Box bg="white" px="4" py="2" mt="6" borderColor="primary" borderWidth="1px" borderStyle="solid" color="primary" borderRadius={0}>
            <Text>Remembered your password? <Link href="/login" as="/login"><a>Sign in.</a></Link></Text>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  const { AUTHENTICATION_TOKEN } = parseCookies(req);

  if (AUTHENTICATION_TOKEN) {
    res.setHeader('location', '/dashboard');
    res.statusCode = 302;
  }

  return {
    props: {},
  };
};

export default Page;
