import { object, string, ref } from 'yup';
import { Grid, Flex } from '@chakra-ui/react';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import usersService from 'services/users';
import useTempPopup from 'hooks/useTempPopup';
import Error from 'components/shared/errors';
import Success from 'components/formControls/success';
import InputV2 from 'components/formControls/inputV2';
import Button from 'components/shared/button';

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
  reset,
  setServerError,
  setServerSuccess,
}) => {
  try {
    setServerError(null);
    setServerSuccess(null);

    await usersService.updatePassword({ data });

    setServerSuccess(true);
    reset();
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
        <Flex
          direction="column"
          width="100%"
          height="100%"
          justifyContent="space-between"
        >
          <Grid gridTemplateColumns="1fr" gridGap={3} mb={3}>
            <InputV2
              label="Current Password"
              isRequired={true}
              id="old_password"
              placeholder="Your current password"
              type="password"
              error={errors.old_password}
              {...register('old_password')}
            />

            <InputV2
              label="New Password"
              isRequired={true}
              id="password"
              placeholder="New password"
              type="password"
              error={errors.password}
              {...register('password')}
            />

            <InputV2
              label="Confirm New Password"
              isRequired={true}
              id="confirm"
              placeholder="Confirm your new password"
              type="password"
              error={errors.confirm}
              {...register('confirm')}
            />
          </Grid>
          {serverError && <Error>{serverError}</Error>}
          <Button type="submit" variant="green" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting' : 'Change password'}
          </Button>
        </Flex>
      </form>

      {serverSuccess && <Success>Password updated</Success>}
    </>
  );
};

export default InfoForm;
