import { object, string, bool } from 'yup';
import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Grid, Heading } from '@chakra-ui/react';

import InputV2 from 'components/formControls/inputV2';
import TextareaV2 from 'components/formControls/textareaV2';
import Error from 'components/shared/errors';
import Switch from 'components/formControls/switch';
import Success from 'components/formControls/success';

import { rem } from 'styles/theme';

import { buttonVariants, labelVariants } from 'components/shared/slice';
import contactService from 'services/contact';
import useTempPopup from 'hooks/useTempPopup';

const Slice = dynamic(() => import('components/shared/slice'));
const Button = dynamic(() => import('components/shared/button'));
const Container = dynamic(() => import('components/layout/container'));
const Content = dynamic(() => import('components/shared/content'));

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

    await contactService.ediForm({ data: values });

    setServerSuccess(true);
    resetForm({});
  } catch (err) {
    setServerError(err?.response?.data?.error?.message);
  }
};

const EDICommitteeForm = ({ primary }) => {
  const [serverError, setServerError] = useTempPopup();
  const [serverSuccess, setServerSuccess] = useTempPopup();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
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

  const { variant } = primary;

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
              label="Club"
              id="club"
              {...register('club')}
              placeholder="The club you currently play for"
              error={errors?.club}
              color={labelVariants[variant]}
            />

            <Switch
              label="Do you wish to be considered for the EDI Committee Chair?"
              id="chair"
              colorScheme="green"
              size="lg"
              display="flex"
              alignItems="center"
              {...register('chair')}
              color={labelVariants[variant]}
            />

            <TextareaV2
              label="Do you have any questions or queries related to the role,
              committee, or announcement?"
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
        {serverSuccess && <Success>Message sent</Success>}
      </Container>
    </Slice>
  );
};

export default EDICommitteeForm;
