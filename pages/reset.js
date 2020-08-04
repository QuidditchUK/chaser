import React, { useState } from 'react';
import styled from 'styled-components';
import * as Yup from 'yup';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers';
import Router, { useRouter } from 'next/router';
import { Box, Grid, Flex } from 'components/layout';
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
const Required = dynamic(() => import('components/required'));

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

const Reset = () => {
  const [serverError, setServerError] = useState(null);
  const { query } = useRouter();
  const { token, uuid } = query;

  const {
    register,
    handleSubmit,
    errors,
    formState,
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(ResetFormSchema),
    defaultValues: {
      password: '',
      confirm: '',
    },
  });

  const { isSubmitting } = formState;

  const handleResetSubmit = async ({ confirm, ...formData }) => {
    try {
      setServerError(null);
      const { data } = await api.post('/users/reset', { ...formData, token, uuid });

      setCookies('AUTHENTICATION_TOKEN', data.access_token);

      Router.push('/dashboard');
    } catch (err) {
      setServerError(err?.response?.data?.error?.message);
    }
  };

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

          <form onSubmit={handleSubmit((values) => handleResetSubmit(values))}>
            <Grid gridTemplateColumns="1fr">
              <Label htmlFor="password">
                New Password <Required />
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

              <Label htmlFor="confirm">
                Confirm New Password <Required />
              </Label>

              <Input
                name="confirm"
                placeholder="Confirm your new password"
                ref={register}
                my={3}
                type="password"
                error={errors.confirm}
              />

              {errors.confirm && <InlineError marginBottom={3}>{errors.confirm.message}</InlineError>}
            </Grid>

            <Button type="submit" variant="green" disabled={isSubmitting}>{isSubmitting ? 'Submitting' : 'Reset password'}</Button>
          </form>

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

export default Reset;
