import { Fragment, useEffect } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  IconButton,
  Heading,
  Text,
  Box,
  UnorderedList,
  ListItem,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { CloseIcon, ChatIcon, SettingsIcon } from '@chakra-ui/icons';
import useCachedResponse from 'hooks/useCachedResponse';
import usersService from 'services/users';
import format from 'date-fns/format';
import Link from 'next/link';
import cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { NotificationLink } from 'constants/notifications';

import Image from 'components/shared/image';
import useResponse from 'hooks/useResponse';
import { useQueryClient } from 'react-query';

const LinkWrapper = ({ children, ...notification }) => {
  const href = NotificationLink[notification?.type_id].url;
  return (
    <Link href={href} passHref>
      <ChakraLink textDecoration="none" _hover={{ textDecoration: 'none' }}>
        {children}
      </ChakraLink>
    </Link>
  );
};

const Notification = ({ notification, refetch, onClose }) => {
  const queryClient = useQueryClient();
  const Wrapper = NotificationLink[notification?.type_id]?.url
    ? LinkWrapper
    : Fragment;

  const { mutate: markAsRead } = useResponse({
    queryFn: usersService.markNotificationRead,
    onSettled: () => {
      queryClient.invalidateQueries('/users/notifications/unread');
      refetch();
    },
  });

  const { mutate: deleteNotification } = useResponse({
    queryFn: usersService.deleteNotification,
    onSettled: () => {
      queryClient.invalidateQueries('/users/notifications');
    },
  });

  useEffect(() => {
    if (!notification?.read) {
      const timer = setTimeout(() => {
        markAsRead({
          notification_uuid: notification?.uuid,
          data: { read: true },
        });
      }, 5000);

      return () => clearTimeout(timer);
    }

    return () => {};
  }, [notification?.read, markAsRead, notification?.uuid]);

  return (
    <Wrapper {...notification}>
      <ListItem
        p={4}
        m={0}
        display="grid"
        gridTemplateColumns="60px auto 15px"
        width="100%"
        gridGap={3}
        borderRadius="lg"
        bg={notification?.read ? 'gray.50' : 'gray.100'}
        _hover={{ bg: 'gray.200' }}
        alignItems="center"
        onClick={onClose}
      >
        <Image
          src="/images/authors/quk-logo.png"
          alt="QUK logo"
          borderRadius="full"
          height="60px"
          width="60px"
        />
        <Flex width="100%" gap={2} flexDirection="column">
          <Text color="qukBlue" m={0}>
            {notification?.message ?? notification?.type?.description}
          </Text>
          <Text color="qukBlue" m={0} fontStyle="italic" fontSize="xs">
            {format(new Date(notification?.created), 'd/MM/yyyy h:mm a')}
          </Text>
        </Flex>

        <Flex
          flexDirection="column"
          height="100%"
          alignItems="center"
          justifyContent="space-between"
        >
          <IconButton
            justifySelf="start"
            color="qukBlue"
            aria-label="Delete Notification"
            border={0}
            bg="white"
            size="xs"
            _hover={{
              bg: 'gray.100',
              color: 'qukBlue',
            }}
            p={0}
            icon={<CloseIcon w={2} h={2} />}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              deleteNotification({ notification_uuid: notification?.uuid });
            }}
          />
          <Box
            bg="monarchRed"
            justifySelf="end"
            borderRadius="full"
            h="15px"
            w="15px"
            display={notification?.read ? 'none' : 'block'}
          />
        </Flex>
      </ListItem>
    </Wrapper>
  );
};

function Notifications({ isOpen, onClose }) {
  const { push } = useRouter();
  const token = cookies.get('AUTHENTICATION_TOKEN');

  const { data, refetch } = useCachedResponse({
    queryKey: '/users/notifications',
    queryFn: usersService.getNotifications,
    enabled: Boolean(token),
  });

  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="right" size="sm">
      <DrawerOverlay />
      <DrawerContent bg="white" px={5} pt={3} overflowY="auto">
        <Flex justifyContent="space-between" alignItems="center" h="70px">
          <Heading as="h2" color="qukBlue" fontFamily="body" fontSize="2xl">
            Notifications
          </Heading>
          <Flex gridGap={2}>
            <IconButton
              color="qukBlue"
              aria-label="Close"
              border={0}
              bg="white"
              _hover={{
                bg: 'gray.100',
                color: 'qukBlue',
              }}
              p={0}
              icon={<SettingsIcon w={4} h={4} />}
              onClick={() => {
                push('/dashboard/account/info');
                onClose();
              }}
            />
            <IconButton
              color="qukBlue"
              aria-label="Close"
              border={0}
              bg="white"
              _hover={{
                bg: 'gray.100',
                color: 'qukBlue',
              }}
              p={0}
              icon={<CloseIcon w={4} h={4} />}
              onClick={onClose}
            />
          </Flex>
        </Flex>

        {data?.length === 0 && (
          <Flex
            height="100%"
            width="100%"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
          >
            <ChatIcon color="gray.200" w={150} h={150} />
            <Text color="gray.500">
              This is where your notifications will appear.
            </Text>
          </Flex>
        )}

        {data?.length !== 0 && (
          <UnorderedList
            listStyleType="none"
            p={0}
            m={0}
            width="100%"
            display="flex"
            flexDirection="column"
            gap={3}
          >
            {data?.map((notification) => (
              <Notification
                key={notification?.uuid}
                notification={notification}
                refetch={refetch}
                onClose={onClose}
              />
            ))}
          </UnorderedList>
        )}
      </DrawerContent>
    </Drawer>
  );
}

export default Notifications;
