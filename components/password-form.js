/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { Box, Grid } from 'components';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Input from 'components/input';
import Label from 'components/label';
import Button from 'components/button';
import { InlineError } from 'components/errors';
import Content from 'components/content';
import { api } from 'modules/api';
import Required from 'components/required';

const PasswordFormSchema = Yup.object().shape({
  old_password: Yup.string()
    .min(8, 'Must be at least 8 characters long')
    .required('Required'),
  password: Yup.string()
    .min(8, 'Must be at least 8 characters long')
    .required('Required'),
  confirm: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Required'),
});

const handlePasswordSubmit = async (
  { confirm, ...values },
  resetForm,
  setServerError,
  setServerSuccess
) => {
  try {
    setServerError(null);
    setServerSuccess(null);

    await api.put('/users/password', values);

    setServerSuccess(true);
    resetForm({});
  } catch (err) {
    setServerError(err?.response?.data?.error?.message);
  }
};

const InfoForm = () => {
  const { register, handleSubmit, errors, reset, formState } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(PasswordFormSchema),
    defaultValues: {
      old_password: '',
      password: '',
      confirm: '',
    },
  });

  const { isSubmitting } = formState;

  const [serverError, setServerError] = useState(null);
  const [serverSuccess, setServerSuccess] = useState(null);

  useEffect(() => {
    if (serverSuccess) {
      const timer = setTimeout(() => {
        setServerSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }

    return () => {};
  }, [serverSuccess]);

  return (
    <>
      <form
        onSubmit={handleSubmit((values) =>
          handlePasswordSubmit(values, reset, setServerError, setServerSuccess)
        )}
      >
        <Grid gridTemplateColumns="1fr">
          <Label htmlFor="old_password">
            Current Password <Required />
          </Label>

          <Input
            name="old_password"
            placeholder="Your current password"
            ref={register}
            my={3}
            type="password"
            error={errors.old_password}
          />

          {errors.old_password && (
            <InlineError marginBottom={3}>
              {errors.old_password.message}
            </InlineError>
          )}

          <Label htmlFor="password">
            New Password <Required />
          </Label>

          <Input
            name="password"
            placeholder="Password"
            ref={register}
            my={3}
            type="password"
            error={errors.password}
          />
          {errors.password && (
            <InlineError marginBottom={3}>
              {errors.password.message}
            </InlineError>
          )}

          <Label htmlFor="confirm">
            Confirm New Password <Required />
          </Label>

          <Input
            name="confirm"
            placeholder="Confirm your new password"
            my={3}
            ref={register}
            type="password"
            error={errors.confirm}
          />

          {errors.confirm && (
            <InlineError marginBottom={3}>{errors.confirm.message}</InlineError>
          )}
        </Grid>
        <Button type="submit" variant="green" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting' : 'Change password'}
        </Button>
      </form>

      {serverError && (
        <>
          <InlineError my={3}>{serverError}</InlineError>
        </>
      )}

      {serverSuccess && (
        <Box
          bg="qukBlue"
          px="4"
          py="2"
          mt="6"
          borderColor="qukBlue"
          borderWidth="1px"
          borderStyle="solid"
          color="white"
          borderRadius="sm"
        >
          <Content>Password updated</Content>
        </Box>
      )}
    </>
  );
};

export default InfoForm;
