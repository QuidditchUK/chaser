import React, { useState } from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
import Router from 'next/router';
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
import Required from 'components/required';
import { api } from 'modules/api';
import { setCookies } from 'modules/cookies';
import { event } from 'modules/analytics';
import { CATEGORIES } from 'constants/analytics';

const Text = styled(Content)`
  a {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const JoinFormSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Please enter a valid email address'),
  first_name: Yup.string().required('Please enter your first name'),
  last_name: Yup.string().required('Please enter your last name'),
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
    const { data } = await api.post('/users', formData);

    setCookies('AUTHENTICATION_TOKEN', data.access_token);

    event({
      action: 'Joined',
      category: CATEGORIES.MEMBERSHIP,
    });

    setSubmitting(false);
    Router.push('/dashboard');
  } catch (err) {
    setServerError(err?.response?.data?.error?.message);
    setSubmitting(false);
  }
};

const logo = '/images/logo.png';

const Page = () => {
  const [serverError, setServerError] = useState(null);
  return (
    <>
      <Meta description="Join QuidditchUK to manage your QuidditchUK Membership, Account details and more" subTitle="Join QuidditchUK" />
      <Box
        backgroundImage="url(https://images.prismic.io/chaser/60b691d5-72f3-42d0-b634-b2548525fd65_QD_FN-325.jpg?auto=compress,format)"
        backgroundColor="primary"
        backgroundSize="cover"
        backgroundPosition="center"
        position="relative"
      >
        <Flex
          position="absolute"
          height="100%"
          zIndex={1}
          bg="primary"
          opacity={0.8}
          width="100%"
        />

        <Container
          maxWidth={rem(500)}
          py={{ _: 4, l: 10 }}
          px={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}
        >
          <Box borderRadius={1} bg="white" zIndex={2} position="relative" px={4} py={4}>
            <Flex justifyContent="center" alignItems="center"><Logo src={logo} alt="Quidditch UK" /></Flex>
            <Heading as="h1" isBody textAlign="center">Join QuidditchUK</Heading>
            <Content pb={5}>Join QuidditchUK to manage your QuidditchUK and Club Membership, and register for official events</Content>

            <Formik
              initialValues={{
                email: '',
                password: '',
                confirm: '',
              }}
              onSubmit={(values, { setSubmitting }) => handleSubmit(values, setSubmitting, setServerError)}
              validationSchema={JoinFormSchema}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form>
                  <Grid
                    gridTemplateColumns="1fr"
                  >
                    <Label htmlFor="name">
                      Email Address <Required />
                    </Label>

                    <Field
                      name="email"
                      placeholder="Your email address"
                      as={Input}
                      borderColor="greyLight"
                      my={3}
                      error={errors.email && touched.email}
                    />

                    <Label htmlFor="first_name">
                      First name <Required />
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
                      Last name <Required />
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

                    <ErrorMessage name="email" component={InlineError} marginBottom={3} />

                    <Label htmlFor="password">
                      Password <Required />
                    </Label>

                    <Field
                      name="password"
                      placeholder="Password"
                      as={Input}
                      my={3}
                      type="password"
                      borderColor="greyLight"
                      error={errors.password && touched.password}
                    />
                    <ErrorMessage name="password" component={InlineError} marginBottom={3} />

                    <Label htmlFor="confirm">
                      Confirm Password <Required />
                    </Label>

                    <Field
                      name="confirm"
                      placeholder="Confirm your password"
                      as={Input}
                      borderColor="greyLight"
                      my={3}
                      type="password"
                      error={errors.confirm && touched.confirm}
                    />

                    <ErrorMessage name="confirm" component={InlineError} marginBottom={3} />
                  </Grid>
                  <Button type="submit" variant="green" disabled={isSubmitting}>{isSubmitting ? 'Submitting' : 'Join'}</Button>
                </Form>
              )}
            </Formik>

            {serverError && <InlineError my={3}>{serverError}</InlineError>}

            <Box bg="white" px="4" py="2" mt="6" borderColor="primary" borderWidth="1px" borderStyle="solid" color="primary" borderRadius={0}>
              <Text>Already have an account? <Link href="/login" as="/login" passHref><a>Sign in.</a></Link></Text>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Page;
