import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
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
import Required from 'components/required';

const logo = '/images/logo.png';

const InfoFormSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Please enter a valid email address'),
  first_name: Yup.string().required('Please enter the first name you go by'),
  last_name: Yup.string().required('Please enter the last name you go by'),
});

const PasswordFormSchema = Yup.object().shape({
  old_password: Yup.string()
    .min(8, 'Must be at least 8 characters long')
    .required('Required'),
  password: Yup.string()
    .min(8, 'Must be at least 8 characters long')
    .required('Required'),
  confirm: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Required'),
});

const handleInfoSubmit = async (values, setSubmitting, setServerError, setServerSuccess) => {
  try {
    setServerError(null);
    setServerSuccess(null);

    await api.put('/users/me', values);

    setSubmitting(false);
    setServerSuccess(true);
  } catch (err) {
    setServerError(err?.response?.data?.error?.message);
    setSubmitting(false);
  }
};

const handlePasswordSubmit = async ({ confirm, ...values }, setSubmitting, resetForm, setServerError, setServerSuccess) => {
  try {
    setServerError(null);
    setServerSuccess(null);

    await api.put('/users/password', values);

    setSubmitting(false);
    setServerSuccess(true);
    resetForm({});
  } catch (err) {
    setServerError(err?.response?.data?.error?.message);
    setSubmitting(false);
  }
};

const Info = ({ user }) => {
  const [serverError, setServerError] = useState(null);
  const [serverInfoError, setServerInfoError] = useState(null);

  const [serverSuccess, setServerSuccess] = useState(null);
  const [serverInfoSuccess, setServerInfoSuccess] = useState(null);

  useEffect(() => {
    if (serverSuccess || serverInfoSuccess) {
      const timer = setTimeout(() => {
        setServerInfoSuccess(null);
        setServerSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }

    return () => {};
  }, [serverInfoSuccess, serverSuccess]);

  return (
    <>
      <Meta description="Sign in to QuidditchUK to manage your QuidditchUK Membership, Account details and more" subTitle="Sign In" />
      <Box
        bg="greyLight"
        py={{ _: 4, l: 10 }}
        px={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}
      >
        <Container maxWidth={rem(500)}>
          <Flex justifyContent="center" alignItems="center"><Logo src={logo} alt="Quidditch UK" /></Flex>
          <Heading as="h1" isBody textAlign="center">Update your Info</Heading>

          <Formik
            initialValues={{
              email: user.email,
              first_name: user.first_name,
              last_name: user.last_name,
            }}
            onSubmit={(values, { setSubmitting }) => handleInfoSubmit(values, setSubmitting, setServerInfoError, setServerInfoSuccess)}
            validationSchema={InfoFormSchema}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <Grid
                  gridTemplateColumns="1fr"
                >
                  <Label htmlFor="name">
                    Email Address
                  </Label>

                  <Field
                    name="email"
                    placeholder="Your email address"
                    as={Input}
                    my={3}
                    error={errors.email && touched.email}
                  />

                  <ErrorMessage name="email" component={InlineError} marginBottom={3} />

                  <Label htmlFor="first_name">
                    Preferred first name <Required />
                  </Label>

                  <Field
                    name="first_name"
                    placeholder="First name"
                    as={Input}
                    my={3}
                    type="first_name"
                    error={errors.first_name && touched.first_name}
                  />
                  <ErrorMessage name="first_name" component={InlineError} marginBottom={3} />

                  <Label htmlFor="last_name">
                    Preferred last name <Required />
                  </Label>

                  <Field
                    name="last_name"
                    placeholder="Last name"
                    as={Input}
                    my={3}
                    type="last_name"
                    error={errors.last_name && touched.last_name}
                  />
                  <ErrorMessage name="last_name" component={InlineError} marginBottom={3} />
                </Grid>
                <Button type="submit" variant="green" disabled={isSubmitting}>{isSubmitting ? 'Submitting' : 'Update Info'}</Button>
              </Form>
            )}
          </Formik>

          {serverInfoError && (
            <>
              <InlineError my={3}>{serverInfoError}</InlineError>
            </>
          )}

          {serverInfoSuccess && (
            <Box bg="primary" px="4" py="2" mt="6" borderColor="primary" borderWidth="1px" borderStyle="solid" color="white" borderRadius={0}>
              <Content>User updated</Content>
            </Box>
          )}

          <Heading as="h3" isBody color="primary">Change your password</Heading>

          <Formik
            initialValues={{
              old_password: '',
              password: '',
              confirm: '',
            }}
            onSubmit={(values, { setSubmitting, resetForm }) => handlePasswordSubmit(values, setSubmitting, resetForm, setServerError, setServerSuccess)}
            validationSchema={PasswordFormSchema}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <Grid
                  gridTemplateColumns="1fr"
                >
                  <Label htmlFor="old_password">
                    Current Password <Required />
                  </Label>

                  <Field
                    name="old_password"
                    placeholder="Your current password"
                    as={Input}
                    my={3}
                    type="password"
                    error={errors.old_password && touched.old_password}
                  />

                  <ErrorMessage name="old_password" component={InlineError} marginBottom={3} />

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
                <Button type="submit" variant="green" disabled={isSubmitting}>{isSubmitting ? 'Submitting' : 'Change password'}</Button>
              </Form>
            )}
          </Formik>

          {serverError && (
            <>
              <InlineError my={3}>{serverError}</InlineError>
            </>
          )}

          {serverSuccess && (
            <Box bg="primary" px="4" py="2" mt="6" borderColor="primary" borderWidth="1px" borderStyle="solid" color="white" borderRadius={0}>
              <Content>Password updated</Content>
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  const { AUTHENTICATION_TOKEN } = parseCookies(req);

  if (!AUTHENTICATION_TOKEN) {
    res.setHeader('location', '/login');
    res.statusCode = 302;
    res.end();
    return { props: {} };
  }

  const { data: user } = await api.get('/users/me', {
    headers: {
      Authorization: `Bearer ${AUTHENTICATION_TOKEN}`,
    },
  });

  return {
    props: {
      user,
    },
  };
};

Info.propTypes = {
  user: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
};

export default Info;
