import { object, string, bool } from 'yup';
import { Grid } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import useTempPopup from 'hooks/useTempPopup';
import usersService from 'services/users';
import InputV2 from 'components/formControls/inputV2';
import Switch from 'components/formControls/switch';
import Success from 'components/formControls/success';
import Error from 'components/shared/errors';
import Button from 'components/shared/button';
import Content from 'components/shared/content';

const InfoFormSchema = object().shape({
  email: string()
    .email('Invalid email address')
    .required('Please enter a valid email address'),
  first_name: string().required('Please enter the first name you go by'),
  last_name: string().required('Please enter the last name you go by'),
  is_student: bool().required(),
  university: string().when('is_student', {
    is: true,
    then: string()
      .nullable()
      .required('Please enter the university you currently attend'),
    otherwise: string().nullable(),
  }),
});

const handleInfoSubmit = async ({
  values,
  setServerError,
  setServerSuccess,
}) => {
  try {
    setServerError(null);
    setServerSuccess(null);

    await usersService.updateUser({
      data: { ...values, university: values.university || null },
    });

    setServerSuccess(true);
  } catch (err) {
    setServerError(err?.response?.data?.error?.message);
  }
};

const InfoForm = ({ user }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(InfoFormSchema),
    defaultValues: {
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      is_student: user.is_student || false,
      university: user.university,
    },
  });

  const watchIsStudent = watch('is_student');

  const [serverSuccess, setServerSuccess] = useTempPopup();
  const [serverError, setServerError] = useTempPopup();

  return (
    <>
      <form
        onSubmit={handleSubmit((values) =>
          handleInfoSubmit({ values, setServerError, setServerSuccess })
        )}
      >
        <Grid gridTemplateColumns="1fr" gridGap={3}>
          <InputV2
            label="Email Address"
            id="email"
            placeholder="Your email address"
            error={errors.email}
            isRequired={true}
            {...register('email')}
          />

          <InputV2
            label="Preferred first name"
            isRequired={true}
            id="first_name"
            placeholder="First name"
            error={errors.first_name}
            {...register('first_name')}
          />

          <InputV2
            label="Preferred last name"
            isRequired={true}
            id="last_name"
            placeholder="Last name"
            error={errors.last_name}
            {...register('last_name')}
          />

          <Switch
            label="Are you a student?"
            isRequired={true}
            id="is_student"
            colorScheme="green"
            size="lg"
            display="flex"
            alignItems="center"
            {...register('is_student')}
          />

          {watchIsStudent && (
            <>
              <InputV2
                label="What university do you attend?"
                isRequired={true}
                id="university"
                placeholder="Name of your university"
                error={errors.university}
                {...register('university')}
              />

              <Content fontSize="sm" marginBottom={3}>
                We need this as there are some player restrictions in place for
                Student Clubs competing in QuidditchUK events. QuidditchUK may
                require further verification from members regarding their
                student status, should we need it. This information is not
                shared with anyone outside of QuidditchUK, and is purely for our
                own record.
              </Content>
            </>
          )}

          <Button type="submit" variant="green" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting' : 'Update Info'}
          </Button>
        </Grid>
      </form>

      {serverError && <Error>{serverError}</Error>}
      {serverSuccess && <Success>User updated</Success>}
    </>
  );
};

export default InfoForm;
