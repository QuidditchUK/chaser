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
} from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import Router, { useRouter } from 'next/router';
import Headroom from 'react-headroom';
import { Link as PrismicLink } from 'prismic-reactjs';
import { linkResolver } from 'modules/prismic';
import cookies from 'js-cookie';
import { removeCookie } from 'modules/cookies';

import Link from 'next/link';

import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import DesktopNavigation from '../navigationV2/desktop';
import MobileNavigation from '../navigationV2/mobile';

import FacebookIcon from 'public/images/facebook.svg';
import YoutubeIcon from 'public/images/youtube.svg';
import TwitterIcon from 'public/images/twitter.svg';
import InstagramIcon from 'public/images/instagram.svg';
import PersonIcon from 'public/images/person.svg';
import { USER_NAVIGATION } from 'constants/navigation';

const Button = dynamic(() => import('components/shared/button'));
const Logo = dynamic(() => import('components/shared/logo'));

const IconWrapper = (props) => (
  <ChakraLink height="15px" width="15px" {...props} />
);

const Icon = (props) => <Box color="white" {...props} />;

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

export default function Navigation({ data }) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { asPath } = useRouter();
  const loggedIn = cookies.get('AUTHENTICATION_TOKEN');

  const signOut = () => {
    removeCookie('AUTHENTICATION_TOKEN');
    Router.push('/');
  };

  return (
    <>
      <Box as={Headroom} flexShrink="0">
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
                  href={PrismicLink.url(link, linkResolver)}
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
                href="https://www.facebook.com/QuidditchUK"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon as={FacebookIcon} />
              </IconWrapper>

              <IconWrapper
                aria-label="Follow us on Twitter"
                href="https://twitter.com/QuidditchUK"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon as={TwitterIcon} />
              </IconWrapper>

              <IconWrapper
                aria-label="Follow us on Instagram"
                href="https://instagram.com/ukquidditch"
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
                onClick={onClose}
                display="flex"
                alignItems="center"
              >
                <Logo />
              </ChakraLink>
            </Link>

            <DesktopNavigation data={data?.body} />

            <Flex flexDirection="row" gridGap={2} alignItems="center" ml="auto">
              {loggedIn ? (
                <Popover>
                  <PopoverTrigger>
                    <Box w="30px" h="30px">
                      <Box as={PersonIcon} color="qukBlue" cursor="pointer" />
                    </Box>
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
                            onClick={() => signOut()}
                          >
                            Sign out
                          </Box>
                        </ListItem>
                      </UnorderedList>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              ) : (
                <Button href="/login" variant="light">
                  Sign In
                </Button>
              )}

              <IconButton
                display={{ base: 'block', lg: 'none' }}
                ml="auto"
                aria-label="Menu"
                bg="white"
                color="gray.800"
                _hover={{
                  bg: 'white',
                  color: 'qukBlue',
                }}
                border="none"
                p={0}
                icon={
                  isOpen ? (
                    <CloseIcon w={6} h={6} color="qukBlue" />
                  ) : (
                    <HamburgerIcon w={8} h={8} color="qukBlue" />
                  )
                }
                onClick={onOpen}
              />
            </Flex>
          </Flex>
        </Box>
      </Box>

      <Sidebar isOpen={isOpen} onClose={onClose} data={data} />
    </>
  );
}
