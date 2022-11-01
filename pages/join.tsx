import { Dispatch, SetStateAction } from 'react';
import { GetServerSideProps } from 'next';
import { object, string, bool, ref } from 'yup';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import { Box, Grid, Flex, Heading, Text, Link } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { unstable_getServerSession } from 'next-auth/next';
import { signIn } from 'next-auth/react';

import { rem } from 'styles/theme';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import type { JoinFormProps } from 'types/user';

import { getBasePageProps } from 'modules/prismic';

import Error from 'components/shared/errors';

import InputV2 from 'components/formControls/inputV2';
import Switch from 'components/formControls/switch';
import usersService from 'services/users';
import useTempPopup from 'hooks/useTempPopup';
import AuthCallout from 'components/shared/auth-callout';

const Logo = dynamic(() => import('components/shared/logo'));

const Meta = dynamic(() => import('components/shared/meta'));
const Container = dynamic(() => import('components/layout/container'));
const Button = dynamic(() => import('components/shared/button'));

const JoinFormSchema = object().shape({
  email: string()
    .nullable()
    .email('Invalid email address')
    .required('Please enter a valid email address'),
  first_name: string()
    .nullable()
    .required('Please enter the first name you go by'),
  last_name: string()
    .nullable()
    .required('Please enter the last name you go by'),
  password: string()
    .nullable()
    .min(8, 'Must be at least 8 characters long')
    .required('Required'),
  confirm: string()
    .oneOf([ref('password'), null], 'Passwords must match')
    .required('Required'),
  is_student: bool().required(),
  university: string().when('is_student', {
    is: true,
    then: string()
      .nullable()
      .required('Please enter the university you currently attend'),
    otherwise: string(),
  }),
});

const handleJoinSubmit = async (
  { confirm, ...formData }: JoinFormProps,
  setServerError: Dispatch<SetStateAction<string>>
) => {
  const values = { ...formData, university: formData.university || null };

  try {
    setServerError(null);
    await usersService.createUser({ data: values });

    const data = await signIn('credentials', {
      email: values?.email,
      password: values?.password,
      callbackUrl: '/dashboard',
      redirect: false,
    });

    Router.push(data.url);
  } catch (err: any) {
    setServerError(err?.response?.data?.message);
  }
};

const JoinPage = () => {
  const [serverError, setServerError] = useTempPopup();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<JoinFormProps>({
    mode: 'onBlur',
    resolver: yupResolver(JoinFormSchema),
    defaultValues: {
      email: '',
      first_name: '',
      last_name: '',
      is_student: false,
      password: '',
      confirm: '',
    },
  });

  const watchIsStudent = watch('is_student');
  return (
    <>
      <Meta
        description="Join QuadballUK to manage your QuadballUK Membership, Account details and more"
        subTitle="Join QuadballUK"
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
              <Logo />
            </Flex>
            <Heading as="h1" fontFamily="body" textAlign="center">
              Join QuadballUK
            </Heading>
            <Text pb={5} textAlign="center">
              Join QuadballUK to manage your QuadballUK and Club Membership, and
              register for official events
            </Text>

            <form
              onSubmit={handleSubmit((values) =>
                handleJoinSubmit(values, setServerError)
              )}
            >
              <Grid gridTemplateColumns="1fr" gridGap={3}>
                <InputV2
                  label="Email Address"
                  isRequired={true}
                  id="email"
                  placeholder="Your email address"
                  error={errors.email}
                  {...register('email')}
                />

                <InputV2
                  label="Preferred first name"
                  isRequired={true}
                  id="first_name"
                  placeholder="First name"
                  error={errors.first_name}
                  {...register('first_name')}
                />

                <InputV2
                  label="Preferred last name"
                  isRequired={true}
                  id="last_name"
                  placeholder="Last name"
                  error={errors.last_name}
                  {...register('last_name')}
                />

                <Switch
                  label="Are you a student?"
                  id="is_student"
                  colorScheme="green"
                  size="lg"
                  display="flex"
                  alignItems="center"
                  {...register('is_student')}
                />

                {watchIsStudent && (
                  <>
                    <InputV2
                      label="What university do you attend?"
                      isRequired={true}
                      id="university"
                      placeholder="Name of your university"
                      error={errors.university}
                      {...register('university')}
                    />

                    <Text fontSize="sm" marginBottom={3}>
                      We need this as there are some player restrictions in
                      place for Student Clubs competing in QuadballUK events.
                      QuadballUK may require further verification from members
                      regarding their student status, should we need it. This
                      information is not shared with anyone outside of
                      QuadballUK, and is purely for our own record.
                    </Text>
                  </>
                )}

                <InputV2
                  label="Password"
                  isRequired={true}
                  id="password"
                  placeholder="Password"
                  type="password"
                  error={errors.password}
                  {...register('password')}
                />

                <InputV2
                  label="Confirm Password"
                  isRequired={true}
                  id="confirm"
                  placeholder="Confirm your password"
                  type="password"
                  error={errors.confirm}
                  {...register('confirm')}
                />

                <Button type="submit" variant="green" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting' : 'Join'}
                </Button>
              </Grid>
            </form>

            {serverError && <Error>{serverError}</Error>}

            <AuthCallout>
              Already have an account?{' '}
              <NextLink href="/login" passHref>
                <Link color="monarchRed">Sign in.</Link>
              </NextLink>
            </AuthCallout>
          </Box>
        </Container>
      </Box>
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

  return {
    props: basePageProps,
  };
};

export default JoinPage;
