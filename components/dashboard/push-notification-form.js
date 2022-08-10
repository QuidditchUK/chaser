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
    (pn) => pn.device_id === userAgent
  );

  const subscribe = async () => {
    console.log('in subscribe');
    const sw = await navigator?.serviceWorker?.ready;

    const push = await sw?.pushManager?.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    });

    await mutate({
      data: {
        user_uuid: user?.uuid,
        user_agent: userAgent,
        endpoint: push?.endpoint,
        p256dh: push?.p256dh,
        auth: push?.auth,
      },
    });
  };

  return (
    <>
      {data?.length !== 0 && (
        <UnorderedList>
          {data?.map((pn) => (
            <ListItem key={pn.uuid}>
              {pn.uuid} {pn.device_id}
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
