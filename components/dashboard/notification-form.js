import { Grid, Flex } from '@chakra-ui/react';

import { useForm } from 'react-hook-form';

import usersService from 'services/users';
import useTempPopup from 'hooks/useTempPopup';
import Error from 'components/shared/errors';
import Success from 'components/formControls/success';
import Button from 'components/shared/button';
import Switch from 'components/formControls/switch';

const handleNotificationsSubmit = async ({
  values: data,
  setServerError,
  setServerSuccess,
}) => {
  try {
    setServerError(null);
    setServerSuccess(null);

    await usersService.updateUser({ data });

    setServerSuccess(true);
  } catch (err) {
    setServerError(err?.response?.data?.error?.message);
  }
};

const NotificationForm = ({ user }) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      transfer_window_notifications: user?.transfer_window_notifications,
      // scouting_window_notifications: user?.scouting_window_notifications,
      // event_registration_notifications: user?.event_registration_notifications,
    },
  });

  const [serverError, setServerError] = useTempPopup();
  const [serverSuccess, setServerSuccess] = useTempPopup();

  return (
    <>
      <form
        onSubmit={handleSubmit((values) =>
          handleNotificationsSubmit({
            values,
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
            <Switch
              label="Transfer window notifications"
              id="transfer_window_notifications"
              colorScheme="green"
              size="lg"
              display="flex"
              alignItems="center"
              {...register('transfer_window_notifications')}
            />

            {/* <Switch
              label="Scouting notifications"
              isDisabled
              id="scouting_window_notifications"
              colorScheme="green"
              size="lg"
              display="flex"
              alignItems="center"
              {...register('scouting_window_notifications')}
            />

            <Switch
              label="Event registration notifications"
              isDisabled
              id="event_registration_notifications"
              colorScheme="green"
              size="lg"
              display="flex"
              alignItems="center"
              {...register('event_registration_notifications')}
            /> */}
          </Grid>

          {serverError && <Error>{serverError}</Error>}
          {serverSuccess && <Success>Notifications updated</Success>}

          {!serverSuccess && (
            <Button type="submit" variant="green" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting' : 'Update notifications'}
            </Button>
          )}
        </Flex>
      </form>
    </>
  );
};

export default NotificationForm;
