import React, { useState } from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
import Router from 'next/router';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Box, Grid, Flex } from 'components/layout';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Logo } from 'components/logo';
import { InlineError } from 'components/errors';
import { rem } from 'styles/theme';
import { api } from 'modules/api';
import { setCookies, parseCookies } from 'modules/cookies';
import Input from 'components/input';

const Meta = dynamic(() => import('components/meta'));
const Container = dynamic(() => import('components/container'));
const Heading = dynamic(() => import('components/heading'));
const Label = dynamic(() => import('components/label'));
const Button = dynamic(() => import('components/button'));
const Content = dynamic(() => import('components/content'));

const Text = styled(Content)`
  a {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const AlertText = styled(Content)`
  a {
    color: ${({ theme }) => theme.colors.white};
    border-bottom: 1px solid ${({ theme }) => theme.colors.white};

    &:hover {
      text-decoration: none;
    }
  }
`;

const logo = '/images/logo.png';

const LoginFormSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Please enter a valid email address'),
  password: Yup.string()
    .min(8, 'Must be at least 8 characters long')
    .required('Required'),
});

const handleLoginSubmit = async (values, setServerError) => {
  try {
    setServerError(null);

    const { data } = await api.post('/users/login', values);

    setCookies('AUTHENTICATION_TOKEN', data.access_token);

    Router.push('/dashboard');
  } catch (err) {
    setServerError(err?.response?.data?.error?.message);
  }
};

const Page = () => {
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    errors,
    formState,
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(LoginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { isSubmitting } = formState;

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
          <Heading as="h1" isBody textAlign="center">Sign in to QuidditchUK</Heading>

          <form onSubmit={handleSubmit((values) => handleLoginSubmit(values, setServerError))}>

            <Grid
              gridTemplateColumns="1fr"
            >
              <Label htmlFor="name">
                Email Address
              </Label>

              <Input
                name="email"
                placeholder="Your email address"
                ref={register}
                my={3}
                error={errors.email}
              />

              {errors.email && <InlineError marginBottom={3}>{errors.email.message}</InlineError>}

              <Label htmlFor="password">
                Password
              </Label>

              <Input
                name="password"
                placeholder="Password"
                ref={register}
                my={3}
                type="password"
                error={errors.password}
              />
              {errors.password && <InlineError marginBottom={3}>{errors.password.message}</InlineError>}
            </Grid>

            <Button type="submit" variant="green" disabled={isSubmitting}>{isSubmitting ? 'Submitting' : 'Sign in'}</Button>

          </form>

          {serverError && (
            <>
              <InlineError my={3}>{serverError}</InlineError>
              <Box bg="secondary" px="4" py="2" mt="6" borderColor="secondary" borderWidth="1px" borderStyle="solid" color="white" borderRadius={0}>
                <AlertText>Forgot password? <Link href="/forgot" as="/forgot"><a>Request a reset.</a></Link></AlertText>
              </Box>
            </>
          )}

          <Box bg="white" px="4" py="2" mt="6" borderColor="primary" borderWidth="1px" borderStyle="solid" color="primary" borderRadius={0}>
            <Text>New to QuidditchUK? <Link href="/join" as="/join"><a>Create an account.</a></Link></Text>
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
