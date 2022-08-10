import { ListItem, UnorderedList } from '@chakra-ui/react';
import { Text, Box } from '@chakra-ui/react';
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
      const sw = await navigator?.serviceWorker?.ready;
      const push = await sw?.pushManager?.getSubscription();
      await push.unsubscribe();

      await deletePushNotification({ push_uuid: uuid });
    } catch (error) {
      // unsubscribe failed
    }
  };

  return (
    <>
      {data?.length !== 0 && (
        <UnorderedList listStyleType="none" p={0} m={0} spacing={2}>
          {data?.map((pn) => (
            <ListItem
              key={pn.uuid}
              padding={2}
              borderRadius="md"
              bg="white"
              display="grid"
              gridTemplateColumns="30px 1fr auto"
              gridGap={2}
              alignItems="center"
            >
              <Box />
              <Text fontSize="sm" fontWeight="bold" color="qukBlue">
                {pn.user_agent}
              </Text>
              {pn.user_agent === userAgent && (
                <Button
                  onClick={() => deletePush({ uuid: pn.uuid })}
                  variant="secondary"
                >
                  Remove
                </Button>
              )}
            </ListItem>
          ))}
        </UnorderedList>
      )}

      {!hasPushNotificationForDevice && (
        <Button onClick={subscribe}>Subscribe</Button>
      )}
    </>
  );
};

export default PushNotificationForm;
