/* eslint-disable no-unused-vars */
import { useState } from 'react';
import * as Yup from 'yup';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import { Box, Grid, Flex, Heading, Text, Link, Switch } from '@chakra-ui/react';
import { Logo } from 'components/logo';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { InlineError } from 'components/errors';
import { rem } from 'styles/theme';
import { api } from 'modules/api';
import { setCookies } from 'modules/cookies';
import { event } from 'modules/analytics';
import { CATEGORIES } from 'constants/analytics';
import Input from 'components/input';

const Label = dynamic(() => import('components/label'));
const Meta = dynamic(() => import('components/meta'));
const Container = dynamic(() => import('components/container'));
const Button = dynamic(() => import('components/button'));
const Content = dynamic(() => import('components/content'));
const Required = dynamic(() => import('components/required'));

const JoinFormSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Please enter a valid email address'),
  first_name: Yup.string().required('Please enter the first name you go by'),
  last_name: Yup.string().required('Please enter the last name you go by'),
  password: Yup.string()
    .min(8, 'Must be at least 8 characters long')
    .required('Required'),
  confirm: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Required'),
  is_student: Yup.bool().required(),
  university: Yup.string().when('is_student', {
    is: true,
    then: Yup.string().required(
      'Please enter the university you currently attend'
    ),
    otherwise: Yup.string(),
  }),
});

const handleJoinSubmit = async ({ confirm, ...formData }, setServerError) => {
  const values = { ...formData, university: formData.university || null };

  try {
    setServerError(null);
    const { data } = await api.post('/users', values);

    setCookies('AUTHENTICATION_TOKEN', data.access_token);

    event({
      action: 'Joined',
      category: CATEGORIES.MEMBERSHIP,
    });

    Router.push('/dashboard');
  } catch (err) {
    setServerError(err?.response?.data?.error);
  }
};

const logo = '/images/logo.png';

const Page = () => {
  const [serverError, setServerError] = useState(null);

  const { register, handleSubmit, errors, watch, formState } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(JoinFormSchema),
    defaultValues: {
      email: '',
      first_name: '',
      last_name: '',
      is_student: false,
      university: '',
      password: '',
      confirm: '',
    },
  });

  const { isSubmitting } = formState;

  const watchIsStudent = watch('is_student');
  return (
    <>
      <Meta
        description="Join QuidditchUK to manage your QuidditchUK Membership, Account details and more"
        subTitle="Join QuidditchUK"
      />
      <Box
        backgroundImage="url(https://images.prismic.io/chaser/60b691d5-72f3-42d0-b634-b2548525fd65_QD_FN-325.jpg?auto=compress,format)"
        backgroundColor="qukBlue"
        backgroundSize="cover"
        backgroundPosition="center"
        position="relative"
      >
        <Flex
          position="absolute"
          height="100%"
          bg="qukBlue"
          opacity={0.8}
          width="100%"
        />

        <Container
          maxWidth={rem(500)}
          py={{ base: 4, lg: 10 }}
          px={{ base: 4, sm: 8, md: 9 }}
        >
          <Box borderRadius="md" bg="white" position="relative" px={4} py={4}>
            <Flex justifyContent="center" alignItems="center">
              <Logo src={logo} alt="Quidditch UK" />
            </Flex>
            <Heading as="h1" fontFamily="body" textAlign="center">
              Join QuidditchUK
            </Heading>
            <Text pb={5} textAlign="center">
              Join QuidditchUK to manage your QuidditchUK and Club Membership,
              and register for official events
            </Text>

            <form
              onSubmit={handleSubmit((values) =>
                handleJoinSubmit(values, setServerError)
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
                  borderColor={errors.email ? 'alert' : 'greyLight'}
                />

                {errors.email && (
                  <InlineError marginBottom={3}>
                    {errors.email.message}
                  </InlineError>
                )}

                <Label htmlFor="first_name">
                  Preferred first name <Required />
                </Label>

                <Input
                  name="first_name"
                  placeholder="First name"
                  ref={register}
                  my={3}
                  type="first_name"
                  error={errors.first_name}
                  borderColor={errors.first_name ? 'alert' : 'greyLight'}
                />

                {errors.first_name && (
                  <InlineError marginBottom={3}>
                    {errors.first_name.message}
                  </InlineError>
                )}

                <Label htmlFor="last_name">
                  Preferred last name <Required />
                </Label>

                <Input
                  name="last_name"
                  placeholder="Last name"
                  ref={register}
                  my={3}
                  type="last_name"
                  error={errors.last_name}
                  borderColor={errors.last_name ? 'alert' : 'greyLight'}
                />
                {errors.last_name && (
                  <InlineError marginBottom={3}>
                    {errors.last_name.message}
                  </InlineError>
                )}

                <Label htmlFor="is_student">
                  Are you a student? <Required />
                  <Switch
                    name="is_student"
                    ref={register}
                    colorScheme="green"
                    ml={3}
                    my={3}
                    size="lg"
                  />
                </Label>

                {watchIsStudent && (
                  <>
                    <Label htmlFor="last_name">
                      What university do you attend? <Required />
                    </Label>

                    <Input
                      name="university"
                      placeholder="Name of your university"
                      ref={register}
                      my={3}
                      type="university"
                      error={errors.university}
                      borderColor={errors.university ? 'alert' : 'greyLight'}
                    />

                    {errors.university && (
                      <InlineError marginBottom={3}>
                        {errors.university.message}
                      </InlineError>
                    )}

                    <Text fontSize={1} marginBottom={3}>
                      We need this as there are some player restrictions in
                      place for Student Clubs competing in QuidditchUK events.
                      QuidditchUK may require further verification from members
                      regarding their student status, should we need it. This
                      information is not shared with anyone outside of
                      QuidditchUK, and is purely for our own record.
                    </Text>
                  </>
                )}

                <Label htmlFor="password">
                  Password <Required />
                </Label>

                <Input
                  name="password"
                  placeholder="Password"
                  ref={register}
                  my={3}
                  type="password"
                  error={errors.password}
                  borderColor={errors.password ? 'alert' : 'greyLight'}
                />
                {errors.password && (
                  <InlineError marginBottom={3}>
                    {errors.password.message}
                  </InlineError>
                )}

                <Label htmlFor="confirm">
                  Confirm Password <Required />
                </Label>

                <Input
                  name="confirm"
                  placeholder="Confirm your password"
                  my={3}
                  ref={register}
                  type="password"
                  error={errors.confirm}
                  borderColor={errors.confirm ? 'alert' : 'greyLight'}
                />

                {errors.confirm && (
                  <InlineError marginBottom={3}>
                    {errors.confirm.message}
                  </InlineError>
                )}
              </Grid>
              <Button type="submit" variant="green" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting' : 'Join'}
              </Button>
            </form>

            {serverError && <InlineError my={3}>{serverError}</InlineError>}

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
                Already have an account?{' '}
                <NextLink href="/login" passHref>
                  <Link color="monarchRed">Sign in.</Link>
                </NextLink>
              </Content>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Page;
