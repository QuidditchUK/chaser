import { useState } from 'react';
import { object, string } from 'yup';
import NextLink from 'next/link';
import dynamic from 'next/dynamic';
import { Box, Grid, Flex, Link, Heading } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { rem } from 'styles/theme';
import { api } from 'modules/api';
import { parseCookies } from 'modules/cookies';

import Input from 'components/input'; // DO NOT DYNAMIC IMPORT, BREAKS FORMS

const Logo = dynamic(() => import('components/logo'));
const InlineError = dynamic(() =>
  import('components/errors').then(({ InlineError }) => InlineError)
);
const Meta = dynamic(() => import('components/meta'));
const Container = dynamic(() => import('components/container'));
const Label = dynamic(() => import('components/label'));
const Button = dynamic(() => import('components/button'));
const Content = dynamic(() => import('components/content'));

const ForgotFormSchema = object().shape({
  email: string()
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

  const { register, handleSubmit, errors, formState } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(ForgotFormSchema),
    defaultValues: {
      email: '',
    },
  });

  const { isSubmitting } = formState;

  return (
    <>
      <Meta
        description="Forgot your password for QuidditchUK, request a reset here"
        subTitle="Forgot Password"
      />
      <Box
        bg="greyLight"
        py={{ base: 4, lg: 10 }}
        px={{ base: 4, sm: 8, md: 9 }}
      >
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
                </Grid>
                <Button type="submit" variant="green" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting' : 'Send reset email'}
                </Button>
              </form>

              {serverError && <InlineError my={3}>{serverError}</InlineError>}
            </>
          )}

          {sent && (
            <Content textAlign="center">
              Thank you, your password reset link has been emailed to you.
            </Content>
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
              Remembered your password?{' '}
              <NextLink href="/login" passHref>
                <Link color="monarchRed">Sign in.</Link>
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

export default Forgot;
