import { Grid, ListItem, UnorderedList } from '@chakra-ui/react';
import { Text, Heading } from '@chakra-ui/react';
import UAParser from 'ua-parser-js';
import Button from 'components/shared/button';
import useCachedResponse from 'hooks/useCachedResponse';
import useResponse from 'hooks/useResponse';
import { useEffect, useState } from 'react';
import usersService from 'services/users';

const PushNotificationForm = ({ user }) => {
  const [userAgent, setUserAgent] = useState();

  useEffect(() => {
    if (typeof window !== undefined && !userAgent) {
      setUserAgent(window?.navigator?.userAgent);
    }
  }, [userAgent, setUserAgent]);

  const { data, refetch } = useCachedResponse({
    queryKey: '/users/push-notifications',
    queryFn: usersService.getPushNotifications,
  });

  const { mutate } = useResponse({
    queryFn: usersService.createPushNotification,
    onSettled: refetch,
  });

  const { mutate: deletePushNotification } = useResponse({
    queryFn: usersService.deletePushNotification,
    onSettled: refetch,
  });

  const hasPushNotificationForDevice = data?.some(
    (pn) => pn.user_agent === userAgent
  );

  const subscribe = async () => {
    const sw = await navigator?.serviceWorker?.ready;

    const push = await sw?.pushManager?.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    });

    // must parse + stringify to get keys
    const subscription = JSON.parse(JSON.stringify(push));

    await mutate({
      data: {
        user_uuid: user?.uuid,
        user_agent: userAgent,
        endpoint: subscription?.endpoint,
        p256dh: subscription?.keys?.p256dh,
        auth: subscription?.keys?.auth,
      },
    });
  };

  const deletePush = async ({ uuid }) => {
    try {
      await deletePushNotification({ push_uuid: uuid });

      const sw = await navigator?.serviceWorker?.ready;
      const push = await sw?.pushManager?.getSubscription();

      console.log(push);

      if (push) {
        await push.unsubscribe();
      }
    } catch (error) {
      // unsubscribe failed
    }
  };

  return (
    <Grid gridTemplateRows="min-content auto auto">
      {data?.length !== 0 && (
        <>
          <Heading as="h3" fontFamily="body" fontSize="lg" color="qukBlue">
            Devices
          </Heading>
          <UnorderedList listStyleType="none" p={0} m={0} spacing={2}>
            {data?.map((pn) => {
              const parsedUA = UAParser(pn.user_agent);
              return (
                <ListItem
                  key={pn.uuid}
                  padding={2}
                  borderRadius="md"
                  bg="white"
                  display="grid"
                  gridTemplateColumns="1fr auto"
                  gridGap={2}
                  alignItems="center"
                >
                  <Text fontSize="sm" fontWeight="bold" color="qukBlue">
                    {parsedUA.browser.name} {parsedUA.browser.version} -{' '}
                    {parsedUA.os.name} {parsedUA.os.version}
                  </Text>

                  <Button
                    onClick={() => deletePush({ uuid: pn.uuid })}
                    variant="secondary"
                  >
                    Remove
                  </Button>
                </ListItem>
              );
            })}
          </UnorderedList>
        </>
      )}

      {!hasPushNotificationForDevice && (
        <Button
          mt={data?.length !== 0 ? 3 : 0}
          onClick={subscribe}
          variant="green"
        >
          Allow Push Notifications
        </Button>
      )}
    </Grid>
  );
};

export default PushNotificationForm;
