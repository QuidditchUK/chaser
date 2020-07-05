import React, { useState } from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
import Link from 'next/link';
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
import { parseCookies } from 'modules/cookies';

const Text = styled(Content)`
  a {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const logo = '/images/logo.png';

const LoginFormSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Please enter a valid email address'),
});

const handleSubmit = async (values, setSubmitting, setServerError, setSent) => {
  try {
    setServerError(null);
    api.post('/users/forgot', values);
    setSubmitting(false);
    setSent(true);
  } catch (err) {
    setServerError(err?.response?.data?.error?.message);
    setSubmitting(false);
  }
};

const Page = () => {
  const [serverError, setServerError] = useState(null);
  const [sent, setSent] = useState(false);
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
          <Heading as="h1" isBody textAlign="center">Forgot Password</Heading>

          {!sent && (
            <>
              <Formik
                initialValues={{ email: '' }}
                onSubmit={(values, { setSubmitting }) => handleSubmit(values, setSubmitting, setServerError, setSent)}
                validationSchema={LoginFormSchema}
              >
                {({ errors, touched, isSubmitting }) => (
                  <Form>
                    <Grid gridTemplateColumns="1fr">
                      <Label htmlFor="name">Email Address</Label>

                      <Field
                        name="email"
                        placeholder="Your email address"
                        as={Input}
                        my={3}
                        error={errors.email && touched.email}
                      />

                      <ErrorMessage name="email" component={InlineError} marginBottom={3} />
                    </Grid>
                    <Button type="submit" variant="green" disabled={isSubmitting}>{isSubmitting ? 'Submitting' : 'Send reset email'}</Button>
                  </Form>
                )}
              </Formik>

              {serverError && <InlineError my={3}>{serverError}</InlineError>}
            </>
          )}

          {sent && (<Content textAlign="center">Thank you, your password reset link has been emailed to you.</Content>)}

          <Box bg="white" px="4" py="2" mt="6" borderColor="primary" borderWidth="1px" borderStyle="solid" color="primary" borderRadius={0}>
            <Text>Remembered your password? <Link href="/login" as="/login"><a>Sign in.</a></Link></Text>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export const getServerSideProps = async (ctx) => {
  const { AUTHENTICATION_TOKEN } = parseCookies(ctx.req);

  if (AUTHENTICATION_TOKEN) {
    const { res } = ctx;
    res.setHeader('location', '/dashboard');
    res.statusCode = 302;
  }

  return {
    props: {},
  };
};

export default Page;
