import {
  Flex,
  Text,
  Stack,
  Collapse,
  Icon,
  Link,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import Router from 'next/router';
import NextLink from 'next/link';
import cookies from 'js-cookie';
import { ChevronDownIcon } from '@chakra-ui/icons';

import { removeCookie } from 'modules/cookies';
import { ACCOUNT_NAVIGATION } from 'constants/navigation';

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

export default MobileNav;
