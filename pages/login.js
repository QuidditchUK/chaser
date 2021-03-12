import { useState } from 'react';
import * as Yup from 'yup';
import Router from 'next/router';
import NextLink from 'next/link';
import dynamic from 'next/dynamic';
import { Box, Grid, Flex, Link, Heading } from '@chakra-ui/react';
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
const Label = dynamic(() => import('components/label'));
const Button = dynamic(() => import('components/button'));
const Content = dynamic(() => import('components/content'));

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

  const { register, handleSubmit, errors, formState } = useForm({
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
          <Flex justifyContent="center" alignItems="center">
            <Logo src={logo} alt="Quidditch UK" />
          </Flex>
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

              <Input
                name="email"
                placeholder="Your email address"
                ref={register}
                my={3}
                error={errors.email}
              />

              {errors.email && (
                <InlineError marginBottom={3}>
                  {errors.email.message}
                </InlineError>
              )}

              <Label htmlFor="password">Password</Label>

              <Input
                name="password"
                placeholder="Password"
                ref={register}
                my={3}
                type="password"
                error={errors.password}
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
