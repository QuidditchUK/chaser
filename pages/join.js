import React from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
import Link from 'next/link';
import Layout from 'containers/layout';
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

const Text = styled(Content)`
  a {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const JoinFormSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Please enter a valid email address'),
  password: Yup.string()
    .min(8, 'Must be at least 8 characters long')
    .required('Required'),
  confirm: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Required'),
});

const logo = '/images/logo.png';

const Page = () => (
  <Layout>
    <Meta description="Join QuidditchUK to manage your QuidditchUK Membership, Account details and more" subTitle="Join QuidditchUK" />
    <Box
      bg="greyLight"
      py={{ _: 4, l: 10 }}
      px={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}
    >
      <Container maxWidth={rem(500)}>
        <Flex justifyContent="center" alignItems="center"><Logo src={logo} alt="Quidditch UK" /></Flex>
        <Heading as="h1" isBody textAlign="center">Join QuidditchUK</Heading>

        <Formik
          initialValues={{
            email: '',
            password: '',
            confirm: '',
          }}
          onSubmit={(values, { setSubmitting }) => {
            alert(JSON.stringify(values, null, 2));

            setTimeout(() => {
              setSubmitting(false);
            }, 1000);
          }}
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
                  my={3}
                  error={errors.email && touched.email}
                />

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
                  error={errors.password && touched.password}
                />
                <ErrorMessage name="password" component={InlineError} marginBottom={3} />

                <Label htmlFor="confirm">
                  Confirm Password <Required />
                </Label>

                <Field
                  name="confirm"
                  placeholder="Confirm your Password"
                  as={Input}
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

        <Box bg="white" px="4" py="2" mt="6" borderColor="primary" borderWidth="1px" borderStyle="solid" color="primary" borderRadius={0}>
          <Text>Already have an account? <Link href="/login" as="/login" passHref><a>Sign in.</a></Link></Text>
        </Box>
      </Container>
    </Box>
  </Layout>
);

export default Page;
