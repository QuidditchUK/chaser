import { ReactNode } from 'react';
import {
  Box,
  Flex,
  IconButton,
  Link as ChakraLink,
  useDisclosure,
  HStack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  UnorderedList,
  ListItem,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  BoxProps,
  LinkProps,
  Tooltip,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  CloseIcon,
  BellIcon,
  ChevronDownIcon,
} from '@chakra-ui/icons';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Headroom from 'react-headroom';
import * as prismicH from '@prismicio/helpers';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

import { linkResolver } from 'modules/prismic';
import { hasScope, getPlainScopes } from 'modules/scopes';

import DesktopNavigation from './desktop';
import MobileNavigation from './mobile';
import Notifications from '../notifications';

import { USER_NAVIGATION } from 'constants/navigation';
import { DASHBOARD_SCOPES, CLUB_MANAGEMENT } from 'constants/scopes';
import useCachedResponse from 'hooks/useCachedResponse';
import usersService from 'services/users';

import FacebookIcon from 'public/images/facebook.svg';
import YoutubeIcon from 'public/images/youtube.svg';
import TwitterIcon from 'public/images/twitter.svg';
import InstagramIcon from 'public/images/instagram.svg';
import TiktokIcon from 'public/images/tiktok.svg';
import PersonIcon from 'public/images/person.svg';

const Button = dynamic(() => import('components/shared/button'));
const Logo = dynamic(() => import('components/shared/logo'));

const IconWrapper = (props: LinkProps) => (
  <ChakraLink height="15px" width="15px" {...props} />
);

const Icon = (props: BoxProps) => <Box color="white" {...props} />;

const IconWithTooltip = ({
  label,
  icon,
}: {
  label: string;
  icon: ReactNode;
}) => {
  return (
    <Tooltip
      placement="bottom-end"
      fontSize="sm"
      bg="qukBlue"
      color="white"
      label={label}
      paddingY={2}
      paddingX={3}
      borderRadius="lg"
    >
      <Flex as="span" alignSelf="center">
        {icon}
      </Flex>
    </Tooltip>
  );
};

function Sidebar({ isOpen, onClose, data }) {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="right" size="xs">
      <DrawerOverlay />
      <DrawerContent bg="white" px={5} pt={3} overflowY="auto">
        <MobileNavigation
          onClose={onClose}
          data={data?.body}
          top_level_navigation={data?.top_level_navigation}
        />
      </DrawerContent>
    </Drawer>
  );
}

const NotificationBadge = ({ count = 0 }) => {
  if (!count) {
    return <></>;
  }

  const displayCount = count > 9 ? '9+' : count;
  return (
    <Flex
      bg="monarchRed"
      fontSize="0.62rem"
      color="white"
      h="20px"
      w="20px"
      borderRadius="full"
      alignItems="center"
      justifyContent="center"
      position="relative"
      pl={count > 9 ? 1 : 0}
    >
      {displayCount}
    </Flex>
  );
};

export default function Navigation({ data }) {
  const {
    isOpen: notificationIsOpen,
    onClose: notificationOnClose,
    onOpen: notificationOnOpen,
  } = useDisclosure();
  const {
    isOpen: mobileIsOpen,
    onClose: mobileOnClose,
    onOpen: mobileOnOpen,
  } = useDisclosure();

  const { asPath, push } = useRouter();
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  const { data: unread } = useCachedResponse<{ count: number }>({
    queryKey: '/users/notifications/unread',
    queryFn: usersService.getUnreadNoticationsCount,
    enabled: Boolean(isAuthenticated),
  });

  const handleSignOut = async () => {
    const data = await signOut({ redirect: false, callbackUrl: '/' });
    push(data?.url);
  };

  return (
    <>
      <Box as={Headroom} flexShrink={0} zIndex={50}>
        <Box as="header">
          <Flex
            justifyContent="space-between"
            alignItems="center"
            as="nav"
            h="35px"
            bg="qukBlue"
            px={6}
            fontSize="xs"
            display={{ base: 'none', lg: 'flex' }}
          >
            <HStack spacing={2}>
              {data?.top_level_navigation?.map(({ link_label, link }) => (
                <Link
                  key={link_label}
                  href={prismicH.asLink(link, linkResolver)}
                  passHref
                >
                  <ChakraLink
                    color="white"
                    pr={2}
                    borderRight="1px solid"
                    borderColor="white"
                    _last={{ borderRight: 'none' }}
                    fontWeight={600}
                  >
                    {link_label}
                  </ChakraLink>
                </Link>
              ))}
            </HStack>

            <HStack spacing={5}>
              <IconWrapper
                aria-label="Like us on Facebook"
                href="https://www.facebook.com/quadballuk"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon as={FacebookIcon} />
              </IconWrapper>

              <IconWrapper
                aria-label="Follow us on TikTok"
                href="https://tiktok.com/@quadballuk"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon as={TiktokIcon} />
              </IconWrapper>

              <IconWrapper
                aria-label="Follow us on Instagram"
                href="https://www.instagram.com/quadball_uk"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon as={InstagramIcon} />
              </IconWrapper>
              <IconWrapper
                aria-label="Subscribe to our Youtube Channel"
                href="https://www.youtube.com/channel/UCef5ZmqGJvff6RIqA0KS0wQ"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon as={YoutubeIcon} />
              </IconWrapper>

              <IconWrapper
                aria-label="Follow us on Twitter"
                href="https://twitter.com/QuadballUK"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon as={TwitterIcon} />
              </IconWrapper>
            </HStack>
          </Flex>
          <Flex
            bg="white"
            as="nav"
            color="greyDark"
            minH="60px"
            py={2}
            px={4}
            alignItems="center"
            width="100%"
            boxShadow="md"
            aria-label="Main Navigation"
          >
            <Link href="/" passHref>
              <ChakraLink
                height={{ base: '35px', xl: '45px' }}
                onClick={mobileOnClose}
                display="flex"
                alignItems="center"
              >
                <Logo />
              </ChakraLink>
            </Link>

            <DesktopNavigation data={data?.body} />

            <Flex flexDirection="row" gridGap={2} alignItems="center" ml="auto">
              {isAuthenticated ? (
                <>
                  <Button
                    bg="white"
                    ml="auto"
                    border="none"
                    _hover={{ bg: 'white', color: 'qukBlue' }}
                    onClick={notificationOnOpen}
                    id="notifications"
                    aria-label="Notifications"
                    p={0}
                  >
                    <NotificationBadge count={unread?.count} />
                    <IconWithTooltip
                      icon={
                        <BellIcon
                          color="qukBlue"
                          cursor="pointer"
                          width="28px"
                          height="28px"
                        />
                      }
                      label="Notifications"
                    />
                  </Button>

                  <Popover>
                    <PopoverTrigger>
                      <IconButton
                        icon={
                          <IconWithTooltip
                            icon={
                              <Flex position="relative" alignItems="center">
                                <PersonIcon
                                  width="32px"
                                  height="32px"
                                  color="qukBlue"
                                />
                                <ChevronDownIcon
                                  zIndex="1"
                                  position="absolute"
                                  bottom="-4px"
                                  right="0"
                                  bg="gray.100"
                                  borderRadius="full"
                                  width="15px"
                                  height="15px"
                                  border="1px solid"
                                  borderColor="qukBlue"
                                />
                              </Flex>
                            }
                            label="Account"
                          />
                        }
                        cursor="pointer"
                        w={6}
                        h={6}
                        bg="transparent"
                        _hover={{
                          bg: 'white',
                          color: 'qukBlue',
                        }}
                        color="qukBlue"
                        border={0}
                        padding={1}
                        aria-label="Account"
                      />
                    </PopoverTrigger>
                    <PopoverContent
                      bg="qukBlue"
                      color="white"
                      borderColor="qukBlue"
                    >
                      <PopoverArrow bg="qukBlue" />
                      <PopoverBody as="nav" py={4} px={3}>
                        <UnorderedList
                          listStyleType="none"
                          p={0}
                          m={0}
                          spacing={3}
                        >
                          {hasScope(
                            DASHBOARD_SCOPES,
                            getPlainScopes(session?.user.scopes)
                          ) && (
                            <ListItem tabIndex={0}>
                              <Link href="/admin" passHref>
                                <ChakraLink
                                  display="grid"
                                  gridTemplateColumns="1fr 10px"
                                  p={2}
                                  px={4}
                                  alignItems="center"
                                  textDecoration="none"
                                  color="white"
                                  fontWeight={600}
                                  _hover={{ bg: 'green.700' }}
                                  _active={{ bg: 'green.700' }}
                                  borderRadius="md"
                                  bg={'green.600'}
                                  fontSize="0.875rem"
                                >
                                  Admin Dashboard
                                </ChakraLink>
                              </Link>
                            </ListItem>
                          )}
                          {hasScope(
                            [CLUB_MANAGEMENT],
                            getPlainScopes(session?.user.scopes),
                            false
                          ) && (
                            <ListItem tabIndex={0}>
                              <Link href="/dashboard/club-management" passHref>
                                <ChakraLink
                                  display="grid"
                                  gridTemplateColumns="1fr 10px"
                                  p={2}
                                  px={4}
                                  alignItems="center"
                                  textDecoration="none"
                                  color="white"
                                  fontWeight={600}
                                  _hover={{ bg: 'purple.700' }}
                                  _active={{ bg: 'purple.700' }}
                                  borderRadius="md"
                                  bg={'purple.600'}
                                  fontSize="0.875rem"
                                >
                                  Club Management
                                </ChakraLink>
                              </Link>
                            </ListItem>
                          )}
                          {USER_NAVIGATION.map((item) => {
                            const isActive = item?.href === asPath;

                            return (
                              <ListItem key={item?.label} tabIndex={0}>
                                <Link href={item?.href} passHref>
                                  <ChakraLink
                                    display="grid"
                                    gridTemplateColumns="1fr 10px"
                                    p={2}
                                    px={4}
                                    alignItems="center"
                                    textDecoration="none"
                                    color="white"
                                    fontWeight={600}
                                    _hover={{ bg: 'blue.600' }}
                                    _active={{ bg: 'blue.600' }}
                                    borderRadius="md"
                                    bg={isActive ? 'blue.600' : 'transparent'}
                                    fontSize="0.875rem"
                                  >
                                    {item?.label}
                                  </ChakraLink>
                                </Link>
                              </ListItem>
                            );
                          })}

                          <ListItem tabIndex={0}>
                            <Box
                              display="grid"
                              gridTemplateColumns="1fr 10px"
                              p={2}
                              px={4}
                              alignItems="center"
                              textDecoration="none"
                              color="white"
                              fontWeight={600}
                              _hover={{ bg: 'red.500' }}
                              cursor="pointer"
                              _active={{ bg: 'red.500' }}
                              borderRadius="md"
                              bg="red.600"
                              fontSize="0.875rem"
                              onClick={() => handleSignOut()}
                            >
                              Sign out
                            </Box>
                          </ListItem>
                        </UnorderedList>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </>
              ) : (
                <Button href="/login" variant="light">
                  Sign In
                </Button>
              )}

              <Box
                role="button"
                ml="auto"
                aria-label="Menu"
                cursor="pointer"
                id="menu"
                bg="white"
                color="gray.800"
                _hover={{
                  bg: 'white',
                  color: 'qukBlue',
                }}
                border="none"
                p={0}
                onClick={mobileOnOpen}
              >
                {mobileIsOpen ? (
                  <CloseIcon w={6} h={6} color="qukBlue" />
                ) : (
                  <HamburgerIcon w={8} h={8} color="qukBlue" />
                )}
              </Box>
            </Flex>
          </Flex>
        </Box>
      </Box>

      <Sidebar isOpen={mobileIsOpen} onClose={mobileOnClose} data={data} />
      <Notifications
        isOpen={notificationIsOpen}
        onClose={notificationOnClose}
      />
    </>
  );
}
