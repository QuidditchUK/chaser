import React, { useState } from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Box, Grid, Flex } from 'components/layout';
import { Logo } from 'components/logo';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import { InlineError } from 'components/errors';
import { rem } from 'styles/theme';
import { api } from 'modules/api';
import { parseCookies } from 'modules/cookies';

const Heading = dynamic(() => import('components/heading'));
const Meta = dynamic(() => import('components/meta'));
const Container = dynamic(() => import('components/container'));
const Input = dynamic(() => import('components/input'));
const Label = dynamic(() => import('components/label'));
const Button = dynamic(() => import('components/button'));
const Content = dynamic(() => import('components/content'));

const Text = styled(Content)`
  a {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const logo = '/images/logo.png';

const ForgotFormSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Please enter a valid email address'),
});

const handleForgotSubmit = async (values, setServerError, setSent) => {
  try {
    setServerError(null);
    api.post('/users/forgot', values);
    setSent(true);
  } catch (err) {
    setServerError(err?.response?.data?.error?.message);
  }
};

const Forgot = () => {
  const [serverError, setServerError] = useState(null);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    errors,
    formState,
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(ForgotFormSchema),
    defaultValues: {
      email: '',
    },
  });

  const { isSubmitting } = formState;

  return (
    <>
      <Meta description="Forgot your password for QuidditchUK, request a reset here" subTitle="Forgot Password" />
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
              <form onSubmit={handleSubmit((values) => handleForgotSubmit(values, setServerError, setSent))}>
                <Grid gridTemplateColumns="1fr">
                  <Label htmlFor="name">Email Address</Label>

                  <Input
                    name="email"
                    placeholder="Your email address"
                    ref={register}
                    my={3}
                    error={errors.email}
                  />

                  {errors.email && (<InlineError marginBottom={3}>{errors.email.message}</InlineError>)}
                </Grid>
                <Button type="submit" variant="green" disabled={isSubmitting}>{isSubmitting ? 'Submitting' : 'Send reset email'}</Button>
              </form>

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

export default Forgot;
