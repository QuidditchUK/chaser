import { useState } from 'react';
import { object, string, bool } from 'yup';
import dynamic from 'next/dynamic';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import get from 'just-safe-get';
import { Grid, Flex, Heading, Switch, Text } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';

import Input from 'components/input'; // DO NOT DYNAMIC IMPORT, BREAKS FORMS
import Textarea from 'components/textarea'; // DO NOT DYNAMIC IMPORT, BREAKS FORMS

import { buttonVariants } from 'components/slice';

const Slice = dynamic(() => import('components/slice'));
const Label = dynamic(() => import('components/label'));
const Button = dynamic(() => import('components/button'));
const Container = dynamic(() => import('components/container'));
const Content = dynamic(() => import('components/content'));
const Required = dynamic(() => import('components/required'));
const InlineError = dynamic(() =>
  import('components/errors').then(({ InlineError }) => InlineError)
);

import { api } from 'modules/api';
import { rem } from 'styles/theme';

const EDICommitteeSchema = object().shape({
  name: string().required('Please enter your name'),
  email: string()
    .email('Invalid email address')
    .required('Please enter a valid email address'),
  chair: bool().required(),
});

const handleCommitteeSubmit = async (
  values,
  resetForm,
  setServerError,
  setServerSuccess
) => {
  try {
    setServerError(null);
    setServerSuccess(null);

    await api.post('/contact/edi', values);

    setServerSuccess(true);
    resetForm({});
  } catch (err) {
    setServerError(err?.response?.data?.error?.message);
  }
};

const EDICommitteeForm = (rawData) => {
  const [serverError, setServerError] = useState(null);
  const [serverSuccess, setServerSuccess] = useState(null);

  const { register, handleSubmit, errors, reset, formState } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(EDICommitteeSchema),
    defaultValues: {
      name: '',
      email: '',
      chair: false,
      club: '',
      message: '',
    },
  });

  const { isSubmitting } = formState;

  const variant = get(rawData, 'primary.variant');

  return (
    <Slice variant={variant}>
      <Heading as="h1" fontFamily="body" textAlign="center">
        EDI Committee Expression of Interest
      </Heading>

      <Container maxWidth={rem(500)} paddingBottom={4}>
        <Content fontSize="bodyCard" fontStyle="italic" pb={4}>
          Applications of interest are open for both committee chair and regular
          member positions. These will remain open and be advertised until 31st
          October, QuidditchUK will then be in contact with applicants to
          discuss the role(s).
        </Content>

        <form
          onSubmit={handleSubmit((values) =>
            handleCommitteeSubmit(
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

            <Label htmlFor="club">Club</Label>

            <Input
              name="club"
              placeholder="The club you currently play for"
              ref={register}
              my={3}
            />

            <Label htmlFor="chair">
              Do you wish to be considered for the EDI Committee Chair?{' '}
              <Required />
              <Switch
                name="chair"
                ref={register}
                colorScheme="green"
                ml={3}
                my={3}
                size="lg"
              />
            </Label>

            <Label htmlFor="message">
              Do you have any questions or queries related to the role,
              committee, or announcement?
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
            variant={buttonVariants[variant]}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting' : 'Submit form'}
          </Button>
        </form>

        {serverError && <InlineError my={3}>{serverError}</InlineError>}

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
            <CheckIcon mr={3} /> <Text fontWeight="bold">Message sent</Text>
          </Flex>
        )}
      </Container>
    </Slice>
  );
};

export default EDICommitteeForm;
