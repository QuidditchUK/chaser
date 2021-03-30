import { useState, useEffect } from 'react';
import { object, string, bool } from 'yup';
import dynamic from 'next/dynamic';
import { Flex, Grid, Switch, Text } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

const Input = dynamic(() => import('components/input'));
const Label = dynamic(() => import('components/label'));
const Button = dynamic(() => import('components/button'));
const Content = dynamic(() => import('components/content'));
const Required = dynamic(() => import('components/required'));
const InlineError = dynamic(() =>
  import('components/errors').then(({ InlineError }) => InlineError)
);

import { api } from 'modules/api';

const InfoFormSchema = object().shape({
  email: string()
    .email('Invalid email address')
    .required('Please enter a valid email address'),
  first_name: string().required('Please enter the first name you go by'),
  last_name: string().required('Please enter the last name you go by'),
  is_student: bool().required(),
  university: string().when('is_student', {
    is: true,
    then: string().required('Please enter the university you currently attend'),
    otherwise: string(),
  }),
});

const handleInfoSubmit = async (values, setServerError, setServerSuccess) => {
  const data = { ...values, university: values.university || null };

  try {
    setServerError(null);
    setServerSuccess(null);

    await api.put('/users/me', data);

    setServerSuccess(true);
  } catch (err) {
    setServerError(err?.response?.data?.error?.message);
  }
};

const InfoForm = ({ user }) => {
  const { register, handleSubmit, errors, watch, formState } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(InfoFormSchema),
    defaultValues: {
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      is_student: user.is_student,
      university: user.university,
    },
  });

  const { isSubmitting } = formState;

  const watchIsStudent = watch('is_student');
  const [serverError, setServerError] = useState(null);
  const [serverSuccess, setServerSuccess] = useState(null);

  useEffect(() => {
    if (serverSuccess) {
      const timer = setTimeout(() => {
        setServerSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }

    return () => {};
  }, [serverSuccess]);

  return (
    <>
      <form
        onSubmit={handleSubmit((values) =>
          handleInfoSubmit(values, setServerError, setServerSuccess)
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
            <InlineError marginBottom={3}>{errors.email.message}</InlineError>
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
              />
              {errors.university && (
                <InlineError marginBottom={3}>
                  {errors.university.message}
                </InlineError>
              )}

              <Content fontSize={1} marginBottom={3}>
                We need this as there are some player restrictions in place for
                Student Clubs competing in QuidditchUK events. QuidditchUK may
                require further verification from members regarding their
                student status, should we need it. This information is not
                shared with anyone outside of QuidditchUK, and is purely for our
                own record.
              </Content>
            </>
          )}
        </Grid>
        <Button type="submit" variant="green" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting' : 'Update Info'}
        </Button>
      </form>

      {serverError && (
        <>
          <InlineError my={3}>{serverError}</InlineError>
        </>
      )}

      {serverSuccess && (
        <Flex
          alignItems="center"
          bg="keeperGreen"
          px={4}
          py={1}
          mt={6}
          borderColor="keeperGreen"
          borderWidth="1px"
          borderStyle="solid"
          color="white"
          borderRadius="md"
        >
          <CheckIcon mr={3} /> <Text fontWeight="bold">User updated</Text>
        </Flex>
      )}
    </>
  );
};

export default InfoForm;
