import {
  Box,
  Flex,
  Text,
  Stack,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import Router, { useRouter } from 'next/router';
import cookies from 'js-cookie';

import { removeCookie } from 'modules/cookies';
import { rem } from 'styles/theme';

import NextLink from 'next/link';

const Button = dynamic(() => import('components/button'));
import { ACCOUNT_NAVIGATION } from 'constants/navigation';

import { ChevronRightIcon } from '@chakra-ui/icons';

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

export const DesktopCTAs = ({
  dashboard,
  capeModeIsOpen,
  closeCapeMode,
  openCapeMode,
}) => {
  const loggedIn = cookies.get('AUTHENTICATION_TOKEN');

  const signOut = () => {
    removeCookie('AUTHENTICATION_TOKEN');
    Router.push('/');
  };

  return (
    <Stack direction="row" spacing={3} alignItems="center">
      <Button
        onClick={capeModeIsOpen ? closeCapeMode : openCapeMode}
        variant={dashboard ? 'secondary' : 'primary'}
      >
        <Text
          as="span"
          color="qukBlue"
          textTransform="uppercase"
          borderRadius="full"
          bg="white"
          py={1}
          px={2}
          mr={2}
          fontSize="0.5rem"
        >
          New
        </Text>
        {capeModeIsOpen ? 'Normal' : 'Cape'} Mode
      </Button>
      {/* SWITCH BACK 02/04/2021 */}
      {/* <NextLink href="/find-quidditch" passHref>
        <Button
          as="a"
          variant={dashboard ? 'secondary' : 'primary'}
          textDecoration="none"
          _hover={{ textDecoration: 'none' }}
        >
          Find Quidditch
        </Button>
      </NextLink> */}

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

export default DesktopNav;
