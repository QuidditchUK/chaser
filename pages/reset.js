import { object, string, ref } from 'yup';
import NextLink from 'next/link';
import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Router, { useRouter } from 'next/router';
import { Grid, Flex, Link, Heading } from '@chakra-ui/react';
import { rem } from 'styles/theme';
import { setCookies, parseCookies } from 'modules/cookies';

import { getBasePageProps } from 'modules/prismic';

import InputV2 from 'components/formControls/inputV2';
import Slice from 'components/shared/slice';
import Error from 'components/shared/errors';
import AuthCallout from 'components/shared/auth-callout';
import usersService from 'services/users';
import useTempPopup from 'hooks/useTempPopup';

const Meta = dynamic(() => import('components/shared/meta'));
const Container = dynamic(() => import('components/layout/container'));
const Button = dynamic(() => import('components/shared/button'));

const Logo = dynamic(() => import('components/shared/logo'));

const ResetFormSchema = object().shape({
  password: string()
    .nullable()
    .min(8, 'Must be at least 8 characters long')
    .required('Required'),
  confirm: string()
    .nullable()
    .oneOf([ref('password'), null], 'Passwords must match')
    .required('Required'),
});

const Reset = () => {
  const [serverError, setServerError] = useTempPopup();
  const { query } = useRouter();
  const { token, uuid } = query;

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(ResetFormSchema),
    defaultValues: {
      password: '',
      confirm: '',
    },
  });

  const handleResetSubmit = async ({ confirm, ...formData }) => {
    try {
      setServerError(null);
      const { data } = await usersService.resetPassword({
        data: {
          ...formData,
          token,
          uuid,
        },
      });

      setCookies('AUTHENTICATION_TOKEN', data.access_token);

      Router.push('/dashboard');
    } catch (err) {
      setServerError(err?.response?.data?.error?.message);
    }
  };

  return (
    <>
      <Meta
        description="Forgot your password for QuadballUK, reset it here"
        subTitle="Reset Password"
      />
      <Slice>
        <Container maxWidth={rem(500)}>
          <Flex justifyContent="center" alignItems="center">
            <Logo />
          </Flex>
          <Heading as="h1" fontFamily="body" textAlign="center">
            Reset Password
          </Heading>

          <form onSubmit={handleSubmit((values) => handleResetSubmit(values))}>
            <Grid gridTemplateColumns="1fr" gridGap={3}>
              <InputV2
                label="New Password"
                isRequired
                id="password"
                placeholder="New password"
                type="password"
                error={errors?.password}
                {...register('password')}
              />

              <InputV2
                label="Confirm New Password"
                isRequired
                id="confirm"
                placeholder="Confirm your new password"
                type="password"
                error={errors?.confirm}
                {...register('confirm')}
              />

              <Button type="submit" variant="green" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting' : 'Reset password'}
              </Button>
            </Grid>
          </form>

          {serverError && <Error>{serverError}</Error>}

          <AuthCallout>
            Remembered your password?{' '}
            <NextLink href="/login" passHref>
              <Link color="monarchRed">Sign in.</Link>
            </NextLink>
          </AuthCallout>
        </Container>
      </Slice>
    </>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  const { AUTHENTICATION_TOKEN } = parseCookies(req);

  if (AUTHENTICATION_TOKEN) {
    res.setHeader('location', '/dashboard');
    res.statusCode = 302;
  }

  const basePageProps = await getBasePageProps();

  return {
    props: basePageProps,
  };
};

export default Reset;
