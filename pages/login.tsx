import { useState } from 'react';
import { GetServerSideProps } from 'next';
import { object, string } from 'yup';
import NextLink from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { Grid, Link, Heading } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { rem } from 'styles/theme';

import { unstable_getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';

import { getBasePageProps } from 'modules/prismic';
import InputV2 from 'components/formControls/inputV2';
import Slice from 'components/shared/slice';
import AuthCallout from 'components/shared/auth-callout';
import Error from 'components/shared/errors';

const Meta = dynamic(() => import('components/shared/meta'));
const Container = dynamic(() => import('components/layout/container'));

const Button = dynamic(() => import('components/shared/button'));

const LoginFormSchema = object().shape({
  email: string()
    .email('Invalid email address')
    .required('Please enter a valid email address'),
  password: string()
    .min(8, 'Must be at least 8 characters long')
    .required('Required'),
});

const LoginPage = () => {
  const [serverError, setServerError] = useState(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(LoginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLoginSubmit = async ({ values, setServerError }) => {
    try {
      setServerError(null);

      const data = await signIn('credentials', {
        ...values,
        callbackUrl: '/dashboard',
        redirect: false,
      });
      router.push(data.url);
    } catch (err) {
      setServerError('Login failed');
    }
  };

  return (
    <>
      <Meta
        description="Sign in to QuadballUK to manage your QuadballUK Membership, Account details and more"
        subTitle="Sign In"
      />
      <Slice>
        <Container maxWidth={rem(500)}>
          <Heading as="h1" fontFamily="body" textAlign="center">
            Sign in to QuadballUK
          </Heading>

          <form
            onSubmit={handleSubmit((values) =>
              handleLoginSubmit({ values, setServerError })
            )}
          >
            <Grid gridTemplateColumns="1fr" gridGap={3}>
              <InputV2
                label="Email Address"
                id="email"
                placeholder="Your email address"
                error={errors?.email}
                {...register('email')}
              />
              <InputV2
                label="Password"
                id="password"
                placeholder="Password"
                type="password"
                error={errors?.password}
                {...register('password')}
              />

              <Button type="submit" variant="green" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting' : 'Sign in'}
              </Button>
            </Grid>
          </form>

          {serverError && (
            <>
              <Error>{serverError}</Error>
              <AuthCallout>
                Forgot password?{' '}
                <NextLink href="/forgot" passHref>
                  <Link
                    color="white"
                    borderColor="white"
                    borderBottom="1px solid"
                    _hover={{ textDecoration: 'none' }}
                  >
                    Request a reset.
                  </Link>
                </NextLink>
              </AuthCallout>
            </>
          )}

          <AuthCallout>
            New to QuadballUK?{' '}
            <NextLink href="/join" passHref>
              <Link color="monarchRed">Create an account.</Link>
            </NextLink>
          </AuthCallout>
        </Container>
      </Slice>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const basePageProps = await getBasePageProps();
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
  return { props: basePageProps };
};

export default LoginPage;
