import { object, string, ref } from 'yup';
import { Grid } from '@chakra-ui/react';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import usersService from 'services/users';
import useTempPopup from 'hooks/useTempPopup';
import Error from 'components/shared/errors';
import Success from 'components/formControls/success';
import InputV2 from 'components/formControls/inputV2';
import Button from 'components/shared/button';
import Required from 'components/formControls/required';

const PasswordFormSchema = object().shape({
  old_password: string()
    .min(8, 'Must be at least 8 characters long')
    .required('Required'),
  password: string()
    .min(8, 'Must be at least 8 characters long')
    .required('Required'),
  confirm: string()
    .oneOf([ref('password'), null], 'Passwords must match')
    .required('Required'),
});

const handlePasswordSubmit = async ({
  values: { confirm, ...data },
  resetForm,
  setServerError,
  setServerSuccess,
}) => {
  try {
    setServerError(null);
    setServerSuccess(null);

    await usersService.updatePassword({ data });

    setServerSuccess(true);
    resetForm({});
  } catch (err) {
    setServerError(err?.response?.data?.error?.message);
  }
};

const InfoForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(PasswordFormSchema),
    defaultValues: {
      old_password: '',
      password: '',
      confirm: '',
    },
  });

  const [serverError, setServerError] = useTempPopup();
  const [serverSuccess, setServerSuccess] = useTempPopup();

  return (
    <>
      <form
        onSubmit={handleSubmit((values) =>
          handlePasswordSubmit({
            values,
            reset,
            setServerError,
            setServerSuccess,
          })
        )}
      >
        <Grid gridTemplateColumns="1fr" gridGap={3}>
          <InputV2
            label={
              <>
                Current Password <Required />
              </>
            }
            id="old_password"
            placeholder="Your current password"
            type="password"
            error={errors.old_password}
            {...register('old_password')}
          />

          <InputV2
            label={
              <>
                New Password <Required />
              </>
            }
            id="password"
            placeholder="New password"
            type="password"
            error={errors.password}
            {...register('password')}
          />

          <InputV2
            label={
              <>
                Confirm New Password <Required />
              </>
            }
            id="confirm"
            placeholder="Confirm your new password"
            type="password"
            error={errors.confirm}
            {...register('confirm')}
          />

          <Button type="submit" variant="green" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting' : 'Change password'}
          </Button>
        </Grid>
      </form>

      {serverError && <Error>{serverError}</Error>}
      {serverSuccess && <Success>Password updated</Success>}
    </>
  );
};

export default InfoForm;
