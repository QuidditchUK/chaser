import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { object, string } from 'yup';
import NextLink from 'next/link';
import dynamic from 'next/dynamic';
import { Grid, Flex, Link, Heading } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { getBasePageProps } from 'modules/prismic';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import { rem } from 'styles/theme';

import InputV2 from 'components/formControls/inputV2';
import Slice from 'components/shared/slice';
import Error from 'components/shared/errors';
import AuthCallout from 'components/shared/auth-callout';
import usersService from 'services/users';

const Logo = dynamic(() => import('components/shared/logo'));
const Meta = dynamic(() => import('components/shared/meta'));
const Container = dynamic(() => import('components/layout/container'));
const Button = dynamic(() => import('components/shared/button'));
const Content = dynamic(() => import('components/shared/content'));

const ForgotFormSchema = object().shape({
  email: string()
    .email('Invalid email address')
    .required('Please enter a valid email address'),
});

const handleForgotSubmit = async (values, setServerError, setSent) => {
  try {
    setServerError(null);
    usersService.forgotPassword({ data: values });
    setSent(true);
  } catch (err) {
    setServerError(err?.response?.data?.message);
  }
};

const Forgot = () => {
  const [serverError, setServerError] = useState(null);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(ForgotFormSchema),
    defaultValues: {
      email: '',
    },
  });

  return (
    <>
      <Meta
        description="Forgot your password for QuadballUK, request a reset here"
        subTitle="Forgot Password"
      />
      <Slice>
        <Container maxWidth={rem(500)}>
          <Flex justifyContent="center" alignItems="center">
            <Logo />
          </Flex>
          <Heading as="h1" fontFamily="body" textAlign="center">
            Forgot Password
          </Heading>

          {!sent && (
            <>
              <form
                onSubmit={handleSubmit((values) =>
                  handleForgotSubmit(values, setServerError, setSent)
                )}
              >
                <Grid gridTemplateColumns="1fr" gridGap={3}>
                  <InputV2
                    label="Email address"
                    id="email"
                    placeholder="Your email address"
                    error={errors.email}
                    {...register('email')}
                  />

                  <Button type="submit" variant="green" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting' : 'Send reset email'}
                  </Button>
                </Grid>
              </form>

              {serverError && <Error>{serverError}</Error>}
            </>
          )}

          {sent && (
            <Content textAlign="center">
              Thank you, your password reset link has been emailed to you.
            </Content>
          )}

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

export default Forgot;
