import React, { useState } from 'react';
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
} from 'formik';
import * as Yup from 'yup';
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
import { InlineError } from 'components/errors';
import { api } from 'modules/api';
import { rem } from 'styles/theme';

const ContactFormSchema = Yup.object().shape({
  name: Yup.string().required('Please enter your name'),
  email: Yup.string().email('Invalid email address').required('Please enter a valid email address'),
  message: Yup.string().required('Required'),
});

const handleSubmit = async (values, setSubmitting, setServerError, setServerSuccess) => {
  try {
    setServerError(null);
    setServerSuccess(null);

    await api.put('/contact/form', values);

    setSubmitting(false);
    setServerSuccess(true);
  } catch (err) {
    setServerError(err?.response?.data?.error?.message);
    setSubmitting(false);
  }
};

const ContactForm = (rawData) => {
  const [serverError, setServerError] = useState(null);
  const [serverSuccess, setServerSuccess] = useState(null);

  const data = {
    variant: get(rawData, 'primary.variant'),
  };

  return (
    <PrismicWrapper variant={data.variant}>
      <Heading as="h1" isBody textAlign="center">Contact Us</Heading>
      <Container maxWidth={rem(500)} paddingBottom={4}>
        <Formik
          initialValues={{
            name: '',
            email: '',
            subject: '',
            message: '',
          }}
          onSubmit={(values, { setSubmitting }) => handleSubmit(values, setSubmitting, setServerError, setServerSuccess)}
          validationSchema={ContactFormSchema}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <Grid
                gridTemplateColumns="1fr"
              >
                <Label htmlFor="name">
                  Your name <Required />
                </Label>

                <Field
                  id="name"
                  name="name"
                  placeholder="Your name"
                  as={Input}
                  my={3}
                  error={errors.name && touched.name}
                />

                <ErrorMessage name="name" component={InlineError} marginBottom={3} />

                <Label htmlFor="email">
                  Your email <Required />
                </Label>

                <Field
                  name="email"
                  placeholder="Your email address"
                  as={Input}
                  my={3}
                  error={errors.email && touched.email}
                />

                <ErrorMessage name="email" component={InlineError} marginBottom={3} />

                <Label htmlFor="subject">
                  Subject
                </Label>

                <Field
                  name="subject"
                  placeholder="Subject"
                  as={Input}
                  my={3}
                />

                <Label htmlFor="message">
                  Your message <Required />
                </Label>

                <Field
                  name="message"
                  placeholder="Your message"
                  as={Textarea}
                  my={3}
                  error={errors.message && touched.message}
                />

                <ErrorMessage name="message" component={InlineError} marginBottom={3} />

              </Grid>

              <Button type="submit" variant={buttonVariants[data.variant]} disabled={isSubmitting}>{isSubmitting ? 'Submitting' : 'Contact us'}</Button>
            </Form>
          )}
        </Formik>

        {serverError && (
          <>
            <InlineError my={3}>{serverError}</InlineError>
          </>
        )}

        {serverSuccess && (
          <Box bg="primary" px="4" py="2" mt="6" borderColor="primary" borderWidth="1px" borderStyle="solid" color="white" borderRadius={0}>
            <Content>Message sent</Content>
          </Box>
        )}
      </Container>
    </PrismicWrapper>
  );
};

export default ContactForm;
