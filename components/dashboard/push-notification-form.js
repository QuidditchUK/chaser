import { ListItem, UnorderedList } from '@chakra-ui/react';
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

  return (
    <>
      {data?.length !== 0 && (
        <UnorderedList listStyleType="none">
          {data?.map((pn) => (
            <ListItem key={pn.uuid} padding={2} borderRadius="md" bg="white">
              {pn.user_agent}
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
