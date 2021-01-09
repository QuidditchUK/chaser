import React, { useState } from 'react';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import * as Yup from 'yup';
import { Grid, Box } from 'components/layout';
import Input from 'components/input';
import Label from 'components/label';
import Toggle from 'components/toggle';
import Textarea from 'components/textarea';
import Button from 'components/button';
import PrismicWrapper, { buttonVariants } from 'components/prismic-wrapper';
import Container from 'components/container';
import Heading from 'components/heading';
import Content from 'components/content';
import Required from 'components/required';
import { InlineError } from 'components/errors';
import { api } from 'modules/api';
import { rem } from 'styles/theme';

const YouthCoachFormSchema = Yup.object().shape({
  name: Yup.string().required('Please enter your name'),
  email: Yup.string().email('Invalid email address').required('Please enter a valid email address'),
  phone: Yup.string().matches(/[0-9]{7}/gi, 'Please enter a valid number').required(),
  address: Yup.string().required('Please enter your address'),
  dbs: Yup.bool().required(),
  rightToWork: Yup.bool().required(),
  region: Yup.string().required('Please enter the regions you can coach in'),
  years: Yup.number().typeError('Please enter a valid number').min(0, 'Must be a positive number'),
  availability: Yup.string().required('Please enter the days you are available to work'),
});

const handleYouthCoachSubmit = async (values, resetForm, setServerError, setServerSuccess) => {
  try {
    setServerError(null);
    setServerSuccess(null);

    await api.post('/contact/youth-coach', values);

    setServerSuccess(true);
    resetForm({});
  } catch (err) {
    setServerError(err?.response?.data?.error?.message);
  }
};

const YouthCoachForm = () => {
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
    resolver: yupResolver(YouthCoachFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      club: '',
      years: null,
      dbs: false,
      rightToWork: false,
      region: '',
      availability: '',
      message: '',
    },
  });

  const { isSubmitting } = formState;

  return (
    <>
      <PrismicWrapper variant="primary">
        <Heading as="h1" isBody textAlign="center">Youth Coaching</Heading>
        <Content>
          <p>QuidditchUK’s officially endorsed youth quidditch partner, Enrich Education, are seeking assistants and coaches to help run their growing programme of bringing youth quidditch into schools throughout the country. Assistants and coaches may be paid up to £70.00 per day and are expected to be available between 8:00 am and 3:30 pm.</p>
          <p>Selection will be made by Enrich Education who will contact you regarding potential work as it becomes available. Your role may include refereeing youth quidditch games, assisting or leading coaching sessions with children aged up to 10 years old, and keeping equipment clean and ensuring they are suitable within COVID applications. </p>
          <p>Importantly, those selected will never be expected to run a session by themselves and will always be partnered with an experienced qualified full-time member of Enrich Education. All equipment and resources required will be supplied by Enrich Education.</p>
          <p>You are required to have legal right to work in the United Kingdom to apply, as well as a valid DBS check. Those without a valid DBS check may still apply and Enrich Education will guide you in obtaining this.</p>
        </Content>
      </PrismicWrapper>
      <PrismicWrapper variant="light">
        <Heading as="h1" isBody textAlign="center">Apply to be a Youth Coach</Heading>
        <Container maxWidth={rem(500)} paddingBottom={4}>
          <form onSubmit={handleSubmit((values) => handleYouthCoachSubmit(values, reset, setServerError, setServerSuccess))}>
            <Grid
              gridTemplateColumns="1fr"
            >
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

              <Label htmlFor="phone">
                Your phone number<Required />
              </Label>

              <Input
                name="phone"
                placeholder="Your phone number"
                ref={register}
                my={3}
                error={errors.phone}
              />

              {errors.phone && (<InlineError marginBottom={3}>{errors.phone.message}</InlineError>)}

              <Label htmlFor="address">
                Your address <Required />
              </Label>

              <Input
                name="address"
                placeholder="Your residential address"
                ref={register}
                my={3}
                error={errors.address}
              />

              {errors.address && (<InlineError marginBottom={3}>{errors.address.message}</InlineError>)}

              <Label htmlFor="club">
                Your current or closest club
              </Label>

              <Input
                name="club"
                placeholder="Your current or closest club"
                ref={register}
                my={3}
              />

              <Label htmlFor="years">
                Number of years playing
              </Label>

              <Input
                name="years"
                placeholder="Number of years playing"
                ref={register}
                type="number"
                my={3}
              />

              {errors.years && (<InlineError marginBottom={3}>{errors.years.message}</InlineError>)}

              <Label htmlFor="dbs">Do you have a valid DBS clearance?</Label>

              <Toggle name="dbs" my={3} ref={register} />

              <Label htmlFor="rightToWork">Do you have a right to work in the UK? <Required /></Label>

              <Toggle name="rightToWork" my={3} ref={register} />

              <Label htmlFor="region">
                What area(s) of the UK would you be able to coach in? <Required />
              </Label>

              <Input
                name="region"
                placeholder="Regions e.g. Midlands, South London"
                ref={register}
                my={3}
                error={errors.region}
              />

              {errors.region && (<InlineError marginBottom={3}>{errors.region.message}</InlineError>)}

              <Label htmlFor="availability">
                What days are you generally available for work? <Required />
              </Label>

              <Input
                name="availability"
                placeholder="e.g. Monday - Wednesday"
                ref={register}
                my={3}
                error={errors.availability}
              />

              {errors.availability && (<InlineError marginBottom={3}>{errors.availability.message}</InlineError>)}

              <Label htmlFor="message">
                Anything else to add?
              </Label>

              <Textarea
                name="message"
                placeholder="Your message"
                my={3}
                ref={register}
                error={errors.message}
              />
            </Grid>

            <Button type="submit" variant={buttonVariants.light} disabled={isSubmitting}>{isSubmitting ? 'Submitting' : 'Apply'}</Button>
          </form>

          <Content pt={3}>
            Please note your information will be shared with relevant third parties for the purposes of selecting and hiring potential coaches and/or assistants. This includes Enrich Education and any of their staff, contractors, or subsidiaries.
          </Content>

          {serverError && (
            <>
              <InlineError my={3}>{serverError}</InlineError>
            </>
          )}

          {serverSuccess && (
            <Box bg="keeperGreen" px="4" py="2" mt="6" borderColor="keeperGreen" borderWidth="1px" borderStyle="solid" color="white" borderRadius={0}>
              <Content>Application sent</Content>
            </Box>
          )}
        </Container>
      </PrismicWrapper>
    </>
  );
};

export default YouthCoachForm;
