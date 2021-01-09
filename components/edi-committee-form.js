import React, { useState } from 'react';
import * as Yup from 'yup';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import get from 'just-safe-get';
import { Grid, Box } from 'components/layout';
import Input from 'components/input';
import Label from 'components/label';
import Textarea from 'components/textarea';
import Button from 'components/button';
import PrismicWrapper, { buttonVariants } from 'components/prismic-wrapper';
import Container from 'components/container';
import Heading from 'components/heading';
import Content from 'components/content';
import Required from 'components/required';
import Toggle from 'components/toggle';
import { InlineError } from 'components/errors';
import { api } from 'modules/api';
import { rem } from 'styles/theme';

const EDICommitteeSchema = Yup.object().shape({
  name: Yup.string().required('Please enter your name'),
  email: Yup.string().email('Invalid email address').required('Please enter a valid email address'),
  chair: Yup.bool().required(),
});

const handleCommitteeSubmit = async (values, resetForm, setServerError, setServerSuccess) => {
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

  const {
    register,
    handleSubmit,
    errors,
    reset,
    formState,
  } = useForm({
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

  const data = {
    variant: get(rawData, 'primary.variant'),
  };

  return (
    <PrismicWrapper variant={data.variant}>
      <Heading as="h1" isBody textAlign="center">EDI Committee Expression of Interest</Heading>

      <Container maxWidth={rem(500)} paddingBottom={4}>
        <Content fontSize="bodyCard" fontStyle="italic" pb={4}>
          Applications of interest are open for both committee chair and regular member positions. These will remain open and be advertised until 31st October, QuidditchUK will then be in contact with applicants to discuss the role(s).
        </Content>

        <form onSubmit={handleSubmit((values) => handleCommitteeSubmit(values, reset, setServerError, setServerSuccess))}>
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

            {errors.name && (<InlineError marginBottom={3}>{errors.name.message}</InlineError>)}

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

            {errors.email && (<InlineError marginBottom={3}>{errors.email.message}</InlineError>)}

            <Label htmlFor="club">
              Club
            </Label>

            <Input
              name="club"
              placeholder="The club you currently play for"
              ref={register}
              my={3}
            />

            <Label htmlFor="chair">Do you wish to be considered for the EDI Committee Chair? <Required /></Label>

            <Toggle name="chair" my={3} ref={register} />

            <Label htmlFor="message">
              Do you have any questions or queries related to the role, committee, or announcement?
            </Label>

            <Textarea
              name="message"
              placeholder="Your message"
              my={3}
              ref={register}
              error={errors.message}
            />

            {errors.message && (<InlineError marginBottom={3}>{errors.message.message}</InlineError>)}
          </Grid>

          <Button type="submit" variant={buttonVariants[data.variant]} disabled={isSubmitting}>{isSubmitting ? 'Submitting' : 'Submit form'}</Button>
        </form>

        {serverError && (<InlineError my={3}>{serverError}</InlineError>)}

        {serverSuccess && (
          <Box bg="keeperGreen" px="4" py="2" mt="6" borderColor="keeperGreen" borderWidth="1px" borderStyle="solid" color="white" borderRadius={0}>
            <Content>Message sent</Content>
          </Box>
        )}
      </Container>
    </PrismicWrapper>
  );
};

export default EDICommitteeForm;
