import { object, string, ref } from 'yup';
import NextLink from 'next/link';
import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import { Grid, Flex, Link, Heading } from '@chakra-ui/react';
import { rem } from 'styles/theme';
import { signIn } from 'next-auth/react';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';

import { getBasePageProps } from 'modules/prismic';

import InputV2 from 'components/formControls/inputV2';
import Slice from 'components/shared/slice';
import Error from 'components/shared/errors';
import AuthCallout from 'components/shared/auth-callout';
import usersService from 'services/users';
import useTempPopup from 'hooks/useTempPopup';
import { GetServerSideProps } from 'next';

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
  const { query, push } = useRouter();
  const { token, email } = query;

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

  const handleResetSubmit = async ({ password }) => {
    try {
      setServerError(null);
      await usersService.resetPassword({
        data: { password, token, email },
      });

      const data = await signIn('credentials', {
        email,
        password,
        callbackUrl: '/dashboard',
        redirect: false,
      });

      push(data.url);
    } catch (err) {
      setServerError(err?.response?.data?.message);
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (session) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }

  return { props: await getBasePageProps() };
};

export default Reset;
