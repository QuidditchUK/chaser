import { useState } from 'react';
import { object, string } from 'yup';
import Router from 'next/router';
import NextLink from 'next/link';
import dynamic from 'next/dynamic';
import { Box, Grid, Flex, Link, Heading } from '@chakra-ui/react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { rem } from 'styles/theme';
import { api } from 'modules/api';
import { setCookies, parseCookies } from 'modules/cookies';
import Input from 'components/formControls/input'; // DO NOT DYNAMIC IMPORT, BREAKS FORMS
import { getBasePageProps } from 'modules/prismic';

const Meta = dynamic(() => import('components/shared/meta'));
const Container = dynamic(() => import('components/layout/container'));
const Label = dynamic(() => import('components/formControls/label'));
const Button = dynamic(() => import('components/shared/button'));
const Content = dynamic(() => import('components/shared/content'));
const Logo = dynamic(() => import('components/shared/logo'));
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
    control,
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
              handleLoginSubmit(values, setServerError)
            )}
          >
            <Grid gridTemplateColumns="1fr">
              <Label htmlFor="name">Email Address</Label>

              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="email"
                    placeholder="Your email address"
                    my={3}
                    error={errors?.email}
                  />
                )}
              />

              {errors.email && (
                <InlineError marginBottom={3}>
                  {errors.email.message}
                </InlineError>
              )}

              <Label htmlFor="password">Password</Label>

              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    name="password"
                    placeholder="Password"
                    my={3}
                    type="password"
                    error={errors.password}
                  />
                )}
              />

              {errors.password && (
                <InlineError marginBottom={3}>
                  {errors.password.message}
                </InlineError>
              )}
            </Grid>

            <Button type="submit" variant="green" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting' : 'Sign in'}
            </Button>
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

export default Page;
