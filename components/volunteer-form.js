import { useState } from 'react';
import { useForm } from 'react-hook-form';
import dynamic from 'next/dynamic';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string } from 'yup';
import get from 'just-safe-get';

import { Grid, Flex, Heading, Text } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import { buttonVariants } from 'components/prismic-wrapper';

const PrismicWrapper = dynamic(() => import('components/prismic-wrapper'));
const Input = dynamic(() => import('components/input'));
const Label = dynamic(() => import('components/label'));
const Textarea = dynamic(() => import('components/textarea'));
const Button = dynamic(() => import('components/button'));
const Container = dynamic(() => import('components/container'));
const Required = dynamic(() => import('components/required'));
const InlineError = dynamic(() =>
  import('components/errors').then(({ InlineError }) => InlineError)
);

import { api } from 'modules/api';
import { rem } from 'styles/theme';

const VolunteerFormSchema = object().shape({
  name: string().required('Please enter your name'),
  email: string()
    .email('Invalid email address')
    .required('Please enter a valid email address'),
  role: string().required('Please enter the role you are applying for'),
  message: string().required('Required'),
});

const handleVolunteerSubmit = async (
  values,
  resetForm,
  setServerError,
  setServerSuccess
) => {
  try {
    setServerError(null);
    setServerSuccess(null);

    await api.post('/contact/volunteer', values);

    setServerSuccess(true);
    resetForm({});
  } catch (err) {
    setServerError(err?.response?.data?.error?.message);
  }
};

const VolunteerForm = (rawData) => {
  const [serverError, setServerError] = useState(null);
  const [serverSuccess, setServerSuccess] = useState(null);

  const { register, handleSubmit, errors, reset, formState } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(VolunteerFormSchema),
    defaultValues: {
      name: '',
      email: '',
      role: '',
      message: '',
    },
  });

  const { isSubmitting } = formState;

  const data = {
    variant: get(rawData, 'primary.variant'),
  };

  return (
    <PrismicWrapper variant={data.variant}>
      <Heading as="h1" fontFamily="body" textAlign="center">
        Apply to Volunteer
      </Heading>
      <Container maxWidth={rem(500)} paddingBottom={4}>
        <form
          onSubmit={handleSubmit((values) =>
            handleVolunteerSubmit(
              values,
              reset,
              setServerError,
              setServerSuccess
            )
          )}
        >
          <Grid gridTemplateColumns="1fr">
            <Label htmlFor="name">
              Your name <Required />
            </Label>

            <Input
              id="name"
              name="name"
              placeholder="Your name"
              ref={register}
              my={3}
              error={errors.name}
            />

            {errors.name && (
              <InlineError marginBottom={3}>{errors.name.message}</InlineError>
            )}

            <Label htmlFor="email">
              Your email <Required />
            </Label>

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

            <Label htmlFor="role">
              Role <Required />
            </Label>

            <Input
              name="role"
              placeholder="The role you're applying for"
              ref={register}
              my={3}
              error={errors.role}
            />

            {errors.role && (
              <InlineError marginBottom={3}>{errors.role.message}</InlineError>
            )}

            <Label htmlFor="message">
              A bit about you <Required />
            </Label>

            <Textarea
              name="message"
              placeholder="Your message"
              my={3}
              ref={register}
              error={errors.message}
            />

            {errors.message && (
              <InlineError marginBottom={3}>
                {errors.message.message}
              </InlineError>
            )}
          </Grid>

          <Button
            type="submit"
            variant={buttonVariants[data.variant]}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting' : 'Apply'}
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
            <CheckIcon mr={3} /> <Text fontWeight="bold">Application sent</Text>
          </Flex>
        )}
      </Container>
    </PrismicWrapper>
  );
};

export default VolunteerForm;
