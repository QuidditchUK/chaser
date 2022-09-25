import { object, string } from 'yup';
import dynamic from 'next/dynamic';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Grid, Heading } from '@chakra-ui/react';
import { buttonVariants, labelVariants } from 'components/shared/slice';

import { rem } from 'styles/theme';

import useTempPopup from 'hooks/useTempPopup';
import Success from 'components/formControls/success';
import Error from 'components/shared/errors';
import InputV2 from 'components/formControls/inputV2';
import TextareaV2 from 'components/formControls/textareaV2';
import contactService from 'services/contact';

const Slice = dynamic(() => import('components/shared/slice'));
const Button = dynamic(() => import('components/shared/button'));
const Container = dynamic(() => import('components/layout/container'));

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

    await contactService.contactForm({ data: values });

    setServerSuccess(true);
    resetForm({});
  } catch (err) {
    setServerError(err?.response?.data?.error?.message);
  }
};

const ContactForm = ({ slice }) => {
  const { primary } = slice;
  const [serverError, setServerError] = useTempPopup();
  const [serverSuccess, setServerSuccess] = useTempPopup();

  const {
    register,
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
          <Grid gridTemplateColumns="1fr" gridGap={3}>
            <InputV2
              label="Your name"
              isRequired
              id="name"
              {...register('name')}
              placeholder="Your name"
              error={errors?.name}
              color={labelVariants[variant]}
            />

            <InputV2
              label="Your Email address"
              isRequired
              id="email"
              {...register('email')}
              placeholder="Your email"
              error={errors?.email}
              color={labelVariants[variant]}
            />

            <InputV2
              label="Subject"
              id="subject"
              {...register('subject')}
              placeholder="Subject"
              error={errors?.subject}
              color={labelVariants[variant]}
            />

            <TextareaV2
              label="Your message"
              isRequired
              id="message"
              placeholder="Your message"
              {...register('message')}
              error={errors?.message}
              color={labelVariants[variant]}
            />

            <Button
              type="submit"
              variant={buttonVariants[variant]}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting' : 'Contact us'}
            </Button>
          </Grid>
        </form>

        {serverError && <Error>{serverError}</Error>}
        {serverSuccess && <Success>Message sent</Success>}
      </Container>
    </Slice>
  );
};

export default ContactForm;
