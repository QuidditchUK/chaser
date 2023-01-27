import { useForm } from 'react-hook-form';
import dynamic from 'next/dynamic';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string } from 'yup';
import { Grid, Heading } from '@chakra-ui/react';

import { buttonVariants, labelVariants } from 'components/shared/slice';
import InputV2 from 'components/formControls/inputV2';
import TextareaV2 from 'components/formControls/textareaV2';
import Error from 'components/shared/errors';
import Success from 'components/formControls/success';

import { rem } from 'styles/theme';
import useTempPopup from 'hooks/useTempPopup';
import contactService from 'services/contact';

const Slice = dynamic(() => import('components/shared/slice'));
const Button = dynamic(() => import('components/shared/button'));
const Container = dynamic(() => import('components/layout/container'));

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

    await contactService.volunteerForm({ data: values });

    setServerSuccess(true);
    resetForm();
  } catch (err) {
    setServerError(err?.response?.data?.error?.message);
  }
};

const VolunteerForm = ({ slice }) => {
  const [serverError, setServerError] = useTempPopup();
  const [serverSuccess, setServerSuccess] = useTempPopup();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(VolunteerFormSchema),
    defaultValues: {
      name: '',
      email: '',
      role: '',
      message: '',
    },
  });
  const { primary } = slice;
  const { variant } = primary;

  return (
    <Slice variant={variant}>
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
              label="Role"
              isRequired
              id="role"
              {...register('role')}
              placeholder="The role you're applying for"
              error={errors?.role}
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
              {isSubmitting ? 'Submitting' : 'Apply'}
            </Button>
          </Grid>
        </form>

        {serverError && <Error>{serverError}</Error>}
        {serverSuccess && <Success>Application sent</Success>}
      </Container>
    </Slice>
  );
};

export default VolunteerForm;
