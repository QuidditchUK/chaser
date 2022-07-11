import { useState } from 'react';
import { object, string } from 'yup';
import Router from 'next/router';
import NextLink from 'next/link';
import dynamic from 'next/dynamic';
import { Box, Grid, Link, Heading } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { rem } from 'styles/theme';

import { setCookies, parseCookies } from 'modules/cookies';
import { getBasePageProps } from 'modules/prismic';
import InputV2 from 'components/formControls/inputV2';
import usersService from 'services/users';

const Meta = dynamic(() => import('components/shared/meta'));
const Container = dynamic(() => import('components/layout/container'));

const Button = dynamic(() => import('components/shared/button'));
const Content = dynamic(() => import('components/shared/content'));

const InlineError = dynamic(() =>
  import('components/shared/errors').then(({ InlineError }) => InlineError)
);

const LoginFormSchema = object().shape({
  email: string()
    .email('Invalid email address')
    .required('Please enter a valid email address'),
  password: string()
    .min(8, 'Must be at least 8 characters long')
    .required('Required'),
});

const handleLoginSubmit = async ({ values, setServerError }) => {
  try {
    setServerError(null);

    const { data } = await usersService.login({ data: values });

    setCookies('AUTHENTICATION_TOKEN', data.access_token);

    Router.push('/dashboard');
  } catch (err) {
    setServerError(err?.response?.data?.error?.message);
  }
};

const LoginPage = () => {
  const [serverError, setServerError] = useState(null);

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

  return (
    <>
      <Meta
        description="Sign in to QuidditchUK to manage your QuidditchUK Membership, Account details and more"
        subTitle="Sign In"
      />
      <Box
        bg="greyLight"
        py={{ base: 4, lg: 10 }}
        px={{ base: 4, sm: 8, md: 9 }}
      >
        <Container maxWidth={rem(500)}>
          <Heading as="h1" fontFamily="body" textAlign="center">
            Sign in to QuidditchUK
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
              <InlineError my={3}>{serverError}</InlineError>
              <Box
                bg="monarchRed"
                px="4"
                py="2"
                mt="6"
                borderColor="monarchRed"
                borderWidth="1px"
                borderStyle="solid"
                color="white"
                borderRadius="sm"
              >
                <Content>
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
                </Content>
              </Box>
            </>
          )}

          <Box
            bg="white"
            px="4"
            py="2"
            mt="6"
            borderColor="qukBlue"
            borderWidth="1px"
            borderStyle="solid"
            color="qukBlue"
            borderRadius="sm"
          >
            <Content>
              New to QuidditchUK?{' '}
              <NextLink href="/join" passHref>
                <Link color="monarchRed">Create an account.</Link>
              </NextLink>
            </Content>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  const basePageProps = await getBasePageProps();
  const { AUTHENTICATION_TOKEN } = parseCookies(req);

  if (AUTHENTICATION_TOKEN) {
    res.setHeader('location', '/dashboard');
    res.statusCode = 302;
  }

  return {
    props: basePageProps,
  };
};

export default LoginPage;
