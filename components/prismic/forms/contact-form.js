import { useState } from 'react';
import { object, string } from 'yup';
import dynamic from 'next/dynamic';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Grid, Flex, Heading, Text } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import { buttonVariants } from 'components/shared/slice';
import Input from 'components/formControls/input'; // DO NOT DYNAMIC IMPORT, BREAKS FORMS
import Textarea from 'components/formControls/textarea'; // DO NOT DYNAMIC IMPORT, BREAKS FORMS

import { api } from 'modules/api';
import { rem } from 'styles/theme';

const Slice = dynamic(() => import('components/shared/slice'));
const Label = dynamic(() => import('components/formControls/label'));
const Button = dynamic(() => import('components/shared/button'));
const Container = dynamic(() => import('components/layout/container'));
const Required = dynamic(() => import('components/formControls/required'));
const InlineError = dynamic(() =>
  import('components/shared/errors').then(({ InlineError }) => InlineError)
);

const ContactFormSchema = object().shape({
  name: string().required('Please enter your name'),
  email: string()
    .email('Invalid email address')
    .required('Please enter a valid email address'),
  message: string().required('Required'),
});

const handleContactSubmit = async (
  values,
  resetForm,
  setServerError,
  setServerSuccess
) => {
  try {
    setServerError(null);
    setServerSuccess(null);

    await api.post('/contact/form', values);

    setServerSuccess(true);
    resetForm({});
  } catch (err) {
    setServerError(err?.response?.data?.error?.message);
  }
};

const ContactForm = ({ primary }) => {
  const [serverError, setServerError] = useState(null);
  const [serverSuccess, setServerSuccess] = useState(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(ContactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const { variant } = primary;

  return (
    <Slice variant={variant}>
      <Heading as="h1" fontFamily="body" textAlign="center">
        Contact Us
      </Heading>
      <Container maxWidth={rem(500)} paddingBottom={4}>
        <form
          onSubmit={handleSubmit((values) =>
            handleContactSubmit(values, reset, setServerError, setServerSuccess)
          )}
        >
          <Grid gridTemplateColumns="1fr">
            <Label htmlFor="name">
              Your name <Required />
            </Label>

            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input
                  {...field}
                  id="name"
                  placeholder="Your name"
                  my={3}
                  error={errors.name}
                />
              )}
            />

            {errors.name && (
              <InlineError marginBottom={3}>{errors.name.message}</InlineError>
            )}

            <Label htmlFor="email">
              Your email <Required />
            </Label>

            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <Input
                  {...field}
                  id="email"
                  placeholder="Your email address"
                  my={3}
                  error={errors.email}
                />
              )}
            />

            {errors.email && (
              <InlineError marginBottom={3}>{errors.email.message}</InlineError>
            )}

            <Label htmlFor="subject">Subject</Label>

            <Controller
              control={control}
              name="subject"
              render={({ field }) => (
                <Input {...field} id="subject" placeholder="Subject" my={3} />
              )}
            />

            <Label htmlFor="message">
              Your message <Required />
            </Label>

            <Controller
              control={control}
              name="message"
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="message"
                  placeholder="Your message"
                  my={3}
                  error={errors.message}
                />
              )}
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
            {isSubmitting ? 'Submitting' : 'Contact us'}
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
            <CheckIcon mr={3} /> <Text fontWeight="bold">Message sent</Text>
          </Flex>
        )}
      </Container>
    </Slice>
  );
};

export default ContactForm;
