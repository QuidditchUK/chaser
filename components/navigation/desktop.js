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
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import dynamic from 'next/dynamic';
import Router, { useRouter } from 'next/router';
import NextLink from 'next/link';
import cookies from 'js-cookie';

import { removeCookie } from 'modules/cookies';
import { rem } from 'styles/theme';

const Button = dynamic(() => import('components/button'));
import { ACCOUNT_NAVIGATION } from 'constants/navigation';

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
            <Popover placement={'bottom-start'} isLazy>
              {({ isOpen, onClose }) => (
                <>
                  <PopoverTrigger>
                    {navItem.href ? (
                      <NextLink href={navItem.href} passHref>
                        <Link>
                          <Box
                            as="button"
                            bg="inherit"
                            border="0"
                            cursor="pointer"
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
                            _focus={{
                              textDecoration: 'none',
                              color: 'monarchRed',
                            }}
                          >
                            {navItem.label}
                          </Box>
                        </Link>
                      </NextLink>
                    ) : (
                      <Text
                        as="button"
                        bg="inherit"
                        border="0"
                        px={2}
                        py={0}
                        my={0}
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
                        _focus={{
                          textDecoration: 'none',
                          color: 'monarchRed',
                        }}
                      >
                        {navItem.label}

                        <Icon
                          ml={1}
                          as={ChevronDownIcon}
                          transition={'all .125s ease-in-out'}
                          transform={isOpen ? 'rotate(180deg)' : ''}
                          w="17px"
                          h="17px"
                        />
                      </Text>
                    )}
                  </PopoverTrigger>

                  {navItem.children && (
                    <PopoverContent
                      _focus={{ boxShadow: 'xl' }}
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
                          <DesktopSubNav
                            dashboard={dashboard}
                            key={child.label}
                            onClose={onClose}
                            {...child}
                          />
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

const DesktopSubNav = ({ label, href, onClose, dashboard }) => {
  const { asPath } = useRouter();
  const regexHref = RegExp(href.replace(/\//g, '\\/'), 'g');

  const isActive = regexHref.test(asPath);

  const dashboardColor = dashboard ? 'white' : 'greyDark';

  return (
    <NextLink href={href} passHref>
      <Link textDecoration="none" _hover={{ textDecoration: 'none' }}>
        <Box
          role={'group'}
          display={'block'}
          as="button"
          width="100%"
          cursor="pointer"
          border="0"
          py={2}
          px={4}
          rounded="md"
          onClick={onClose}
          bg={isActive ? 'gray.200' : 'inherit'}
          _hover={{ bg: 'gray.200' }}
          _focus={{ bg: 'gray.200' }}
        >
          <Stack direction={'row'} align={'center'}>
            <Box>
              <Text
                transition={'all .1s ease'}
                color={isActive ? 'qukBlue' : dashboardColor}
                _groupHover={{ color: 'qukBlue' }}
                _groupFocus={{ color: 'qukBlue' }}
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
              _groupFocus={{ opacity: '100%', transform: 'translateX(0)' }}
              justify={'flex-end'}
              align={'center'}
              flex={1}
            >
              <Icon color={'qukBlue'} w={5} h={5} as={ChevronRightIcon} />
            </Flex>
          </Stack>
        </Box>
      </Link>
    </NextLink>
  );
};

export const DesktopCTAs = ({ dashboard }) => {
  const loggedIn = cookies.get('AUTHENTICATION_TOKEN');

  const signOut = () => {
    removeCookie('AUTHENTICATION_TOKEN');
    Router.push('/');
  };

  return (
    <Stack direction="row" spacing={3} alignItems="center">
      <NextLink href="/find-quidditch" passHref>
        <Link>
          <Button
            variant={dashboard ? 'secondary' : 'primary'}
            textDecoration="none"
            _hover={{ textDecoration: 'none' }}
          >
            Find Quidditch
          </Button>
        </Link>
      </NextLink>

      {!loggedIn && (
        <NextLink href="/login" passHref>
          <Link>
            <Button
              variant="light"
              textDecoration="none"
              _hover={{ textDecoration: 'none' }}
            >
              Sign In
            </Button>
          </Link>
        </NextLink>
      )}

      {loggedIn && (
        <Popover placement={'bottom-end'} isLazy>
          {({ isOpen }) => (
            <>
              <PopoverTrigger>
                <Box
                  as="button"
                  px={4}
                  py={2}
                  cursor="pointer"
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
                  _focus={{
                    bg: 'gray.200',
                    textDecoration: 'none',
                    color: 'qukBlue',
                  }}
                >
                  My Account
                  <Icon
                    ml={1}
                    as={ChevronDownIcon}
                    transition={'all .125s ease-in-out'}
                    transform={isOpen ? 'rotate(180deg)' : ''}
                    w="17px"
                    h="17px"
                  />
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
                mt={-1}
                ml={8}
                color={dashboard ? 'white' : 'greyDark'}
              >
                <Stack>
                  {ACCOUNT_NAVIGATION.map((child) => (
                    <DesktopSubNav
                      key={child.label}
                      {...child}
                      dashboard={dashboard}
                    />
                  ))}

                  <Box
                    role={'group'}
                    display={'block'}
                    as="button"
                    width="100%"
                    cursor="pointer"
                    border="0"
                    py={2}
                    px={4}
                    rounded="md"
                    onClick={() => signOut()}
                    bg={'inherit'}
                    _hover={{ bg: 'red.200' }}
                    _focus={{ bg: 'red.200' }}
                  >
                    <Stack direction={'row'} align={'center'}>
                      <Box>
                        <Text
                          transition={'all .15s ease'}
                          _groupHover={{ color: 'monarchRed' }}
                          _groupFocus={{ color: 'monarchRed' }}
                          color={dashboard ? 'white' : 'greyDark'}
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
                        _groupFocus={{
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
