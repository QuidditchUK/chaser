import {
  Box,
  Flex,
  Text,
  IconButton,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import Router, { useRouter } from 'next/router';
import cookies from 'js-cookie';

import { removeCookie } from 'modules/cookies';
import { rem } from 'styles/theme';
import Headroom from 'react-headroom';

import NextLink from 'next/link';

import Button from 'components/button';

import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';

import {
  MAIN_NAVIGATION,
  DASHBOARD_NAVIGATION,
  ACCOUNT_NAVIGATION,
} from 'constants/navigation';
import { Logo } from 'components/logo';

const logo = '/images/logo.png';
const logoText = '/images/logo-text.png';

export default function Navigation({ dashboard = false }) {
  const { isOpen, onToggle: closeTopNav, onClose } = useDisclosure();
  const navigation = dashboard ? DASHBOARD_NAVIGATION : MAIN_NAVIGATION;

  return (
    <Box as={Headroom}>
      <Flex
        bg={dashboard ? 'qukBlue' : 'white'}
        color="greyDark"
        minH="60px"
        py={2}
        px={4}
        align="center"
        justifyContent="space-between"
        width="100%"
        boxShadow="md"
      >
        <Flex
          flex={{ base: 1, xl: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', xl: 'none' }}
        >
          <IconButton
            onClick={closeTopNav}
            icon={
              isOpen ? (
                <CloseIcon
                  w={6}
                  h={6}
                  color={dashboard ? 'white' : 'qukBlue'}
                />
              ) : (
                <HamburgerIcon
                  w={8}
                  h={8}
                  color={dashboard ? 'white' : 'qukBlue'}
                />
              )
            }
            variant={'unstyled'}
            border={0}
            p={0}
            size="lg"
            aria-label={'Toggle Navigation'}
          />
        </Flex>

        <Flex
          justify={{ base: 'center', xl: 'space-between' }}
          alignItems="center"
          direction="row"
          width="100%"
        >
          <NextLink href="/" passHref>
            <Link height={{ base: '35px', xl: '45px' }} onClick={onClose}>
              <Logo
                height={{ base: '35px', xl: '45px' }}
                width={{ base: '35px', xl: '45px' }}
                src={logo}
                alt="Quidditch UK"
                filter={dashboard ? 'brightness(0) invert(1)' : 'inherit'}
              />
              <Logo
                height={{ base: '35px', xl: '45px' }}
                width={{ base: '175px', xl: '225px' }}
                src={logoText}
                alt="Quidditch UK"
                filter={dashboard ? 'brightness(0) invert(1)' : 'inherit'}
              />
            </Link>
          </NextLink>

          <Flex
            display={{ base: 'none', xl: 'flex' }}
            alignItems={{ xl: 'center' }}
          >
            <DesktopNav navigation={navigation} dashboard={dashboard} />

            <DesktopCTAs dashboard={dashboard} />
          </Flex>
        </Flex>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav
          navigation={navigation}
          dashboard={dashboard}
          closeTopNav={closeTopNav}
        />
      </Collapse>
    </Box>
  );
}

const DesktopNav = ({ navigation, dashboard }) => {
  const { asPath } = useRouter();

  return (
    <Stack direction={'row'} spacing={3} mr={4} alignItems="center">
      {navigation.map((navItem) => {
        const regex = navItem?.path
          ? RegExp(navItem?.path.replace(/\//g, '\\/'), 'g')
          : RegExp(navItem?.href.replace(/\//g, '\\/'), 'g');
        const foundPath = navItem?.paths?.find((item) => item === asPath);

        const isActive = regex.test(asPath) || foundPath;

        return (
          <Box key={navItem.label}>
            <Popover trigger={'hover'} placement={'bottom-start'}>
              {({ isOpen }) => (
                <>
                  <PopoverTrigger>
                    <Box>
                      {navItem.href ? (
                        <NextLink href={navItem.href} passHref>
                          <Link
                            as="a"
                            px={2}
                            py={0}
                            fontSize={'md'}
                            fontWeight="bold"
                            color={
                              isActive
                                ? 'monarchRed'
                                : dashboard
                                ? 'white'
                                : 'greyDark'
                            }
                            _hover={{
                              textDecoration: 'none',
                              color: 'monarchRed',
                            }}
                          >
                            {navItem.label}
                          </Link>
                        </NextLink>
                      ) : (
                        <Text
                          px={2}
                          py={0}
                          fontSize={'md'}
                          fontWeight="bold"
                          cursor="pointer"
                          color={
                            isOpen || isActive
                              ? 'monarchRed'
                              : dashboard
                              ? 'white'
                              : 'greyDark'
                          }
                          _hover={{
                            textDecoration: 'none',
                            color: 'monarchRed',
                          }}
                        >
                          {navItem.label}
                        </Text>
                      )}
                    </Box>
                  </PopoverTrigger>

                  {navItem.children && (
                    <PopoverContent
                      border={0}
                      boxShadow={'xl'}
                      bg={dashboard ? 'qukBlue' : 'white'}
                      p={4}
                      ml={-4}
                      rounded={'xl'}
                      maxW={rem(300)}
                      color={dashboard ? 'white' : 'greyDark'}
                    >
                      <Stack>
                        {navItem.children.map((child) => (
                          <DesktopSubNav key={child.label} {...child} />
                        ))}
                      </Stack>
                    </PopoverContent>
                  )}
                </>
              )}
            </Popover>
          </Box>
        );
      })}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href }) => {
  const { asPath } = useRouter();
  const regexHref = RegExp(href.replace(/\//g, '\\/'), 'g');

  const isActive = regexHref.test(asPath);

  return (
    <NextLink href={href} passHref>
      <Link
        as={'a'}
        role={'group'}
        display={'block'}
        py={2}
        px={4}
        rounded={'md'}
        bg={isActive ? 'gray.200' : 'inherit'}
        _hover={{ bg: 'gray.200' }}
      >
        <Stack direction={'row'} align={'center'}>
          <Box>
            <Text
              transition={'all .1s ease'}
              color={isActive ? 'qukBlue' : 'inherit'}
              _groupHover={{ color: 'qukBlue' }}
              fontWeight={500}
              my={0}
            >
              {label}
            </Text>
          </Box>
          <Flex
            transition={'all .1s ease'}
            transform={isActive ? 'translateX(0)' : 'translateX(-10px)'}
            opacity={isActive ? 1 : 0}
            _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
            justify={'flex-end'}
            align={'center'}
            flex={1}
          >
            <Icon color={'qukBlue'} w={5} h={5} as={ChevronRightIcon} />
          </Flex>
        </Stack>
      </Link>
    </NextLink>
  );
};

const DesktopCTAs = ({ dashboard }) => {
  const loggedIn = cookies.get('AUTHENTICATION_TOKEN');

  const signOut = () => {
    removeCookie('AUTHENTICATION_TOKEN');
    Router.push('/');
  };

  return (
    <Stack direction="row" spacing={3} alignItems="center">
      <NextLink href="/find-quidditch" passHref>
        <Button
          as="a"
          variant={dashboard ? 'secondary' : 'primary'}
          textDecoration="none"
          _hover={{ textDecoration: 'none' }}
        >
          Find Quidditch
        </Button>
      </NextLink>

      {!loggedIn && (
        <NextLink href="/login" passHref>
          <Button
            variant="light"
            as="a"
            textDecoration="none"
            _hover={{ textDecoration: 'none' }}
          >
            Sign In
          </Button>
        </NextLink>
      )}

      {loggedIn && (
        <Popover trigger={'hover'} placement={'bottom-end'}>
          {({ isOpen }) => (
            <>
              <PopoverTrigger>
                <Box>
                  <NextLink href="/dashboard" passHref>
                    <Link
                      as="a"
                      px={4}
                      py={2}
                      // mb={0}
                      lineHeight="1.2"
                      fontSize={'md'}
                      fontWeight="normal"
                      bg={isOpen ? 'gray.200' : 'white'}
                      color={'qukBlue'}
                      border="1px solid"
                      borderColor="qukBlue"
                      borderRadius="md"
                      _hover={{
                        bg: 'gray.200',
                        textDecoration: 'none',
                        color: 'qukBlue',
                      }}
                    >
                      My Account
                    </Link>
                  </NextLink>
                </Box>
              </PopoverTrigger>

              <PopoverContent
                border={0}
                boxShadow={'xl'}
                bg={dashboard ? 'qukBlue' : 'white'}
                p={4}
                pt={2}
                rounded={'xl'}
                maxW={rem(300)}
                mt={2}
                ml={8}
                color={dashboard ? 'white' : 'greyDark'}
              >
                <Stack>
                  {ACCOUNT_NAVIGATION.slice(1).map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}

                  <Box onClick={() => signOut()}>
                    <Link
                      role={'group'}
                      display={'block'}
                      py={2}
                      px={4}
                      rounded={'md'}
                      bg={'inherit'}
                      _hover={{ bg: 'red.200' }}
                    >
                      <Stack direction={'row'} align={'center'}>
                        <Box>
                          <Text
                            transition={'all .15s ease'}
                            _groupHover={{ color: 'monarchRed' }}
                            fontWeight={500}
                            my={0}
                          >
                            Sign out
                          </Text>
                        </Box>

                        <Flex
                          transition={'all .15s ease'}
                          transform={'translateX(-10px)'}
                          opacity={0}
                          _groupHover={{
                            opacity: '100%',
                            transform: 'translateX(0)',
                          }}
                          justify={'flex-end'}
                          align={'center'}
                          flex={1}
                        >
                          <Icon
                            color={'monarchRed'}
                            w={5}
                            h={5}
                            as={ChevronRightIcon}
                          />
                        </Flex>
                      </Stack>
                    </Link>
                  </Box>
                </Stack>
              </PopoverContent>
            </>
          )}
        </Popover>
      )}
    </Stack>
  );
};

const MobileNav = ({ navigation, dashboard, closeTopNav }) => {
  return (
    <Stack
      position="absolute"
      bg="white"
      p={4}
      display={{ xl: 'none' }}
      width="100%"
      overflowY="scroll"
      height="100vh"
      fontSize="md"
    >
      {navigation.map((navItem) => (
        <MobileNavItem
          key={navItem.label}
          closeTopNav={closeTopNav}
          {...navItem}
        />
      ))}

      <MobileCTAs dashboard={dashboard} closeTopNav={closeTopNav} />
    </Stack>
  );
};

const MobileNavItem = ({ label, children, closeTopNav, href }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack
      spacing={2}
      onClick={children && onToggle}
      borderBottom="1px solid gray.700"
    >
      <Flex
        borderBottom="1px solid"
        borderColor="gray.200"
        py={1}
        as={Link}
        href={href && !children ? href : null}
        onClick={!children ? closeTopNav : () => {}}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}
      >
        <Text
          my={1}
          fontWeight={600}
          color={useColorModeValue('gray.600', 'gray.200')}
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={'all .125s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack mt={2} pl={4} align={'start'}>
          {children &&
            children.map((child) => (
              <NextLink key={child.label} href={child.href} passHref>
                <Link py={2} href={child.href} onClick={closeTopNav}>
                  {child.label}
                </Link>
              </NextLink>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

const MobileCTAs = ({ closeTopNav }) => {
  const loggedIn = cookies.get('AUTHENTICATION_TOKEN');

  return (
    <>
      <MobileNavItem
        label="Find Quidditch"
        href="/find-quidditch"
        closeTopNav={closeTopNav}
      />
      {!loggedIn && (
        <MobileNavItem
          label="Sign In"
          href="/login"
          closeTopNav={closeTopNav}
        />
      )}

      {loggedIn && <MobileLoggedIn closeTopNav={closeTopNav} />}
    </>
  );
};

const MobileLoggedIn = ({ closeTopNav }) => {
  const { isOpen, onToggle } = useDisclosure();

  const signOut = () => {
    removeCookie('AUTHENTICATION_TOKEN');
    closeTopNav();
    Router.push('/');
  };

  return (
    <Stack spacing={4} onClick={onToggle} borderBottom="1px solid gray.700">
      <Flex
        borderBottom="1px solid"
        borderColor="gray.200"
        py={1}
        cursor="pointer"
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}
      >
        <Text
          my={1}
          fontWeight={600}
          color={useColorModeValue('gray.600', 'gray.200')}
        >
          My Account
        </Text>

        <Icon
          as={ChevronDownIcon}
          transition={'all .125s ease-in-out'}
          transform={isOpen ? 'rotate(180deg)' : ''}
          w={6}
          h={6}
        />
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack mt={2} pl={4} align={'start'}>
          {ACCOUNT_NAVIGATION.map((child) => (
            <NextLink key={child.label} href={child.href} passHref>
              <Link py={2} href={child.href} onClick={closeTopNav}>
                {child.label}
              </Link>
            </NextLink>
          ))}

          <Link py={2} onClick={signOut} color="monarchRed" fontWeight="bold">
            Sign out
          </Link>
        </Stack>
      </Collapse>
    </Stack>
  );
};
