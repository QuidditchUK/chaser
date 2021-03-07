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
} from 'components';
import { useRouter } from 'next/router';

import NextLink from 'next/link';

import Button from 'components/button';

import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@chakra-ui/icons';

import { MAIN_NAVIGATION, DASHBOARD_NAVIGATION } from 'constants/navigation';
import { Logo, LogoLink } from 'components/logo';

const logo = '/images/logo.png';
const logoText = '/images/logo-text.png';

export default function Navigation({ dashboard = false }) {
  const { isOpen, onToggle } = useDisclosure();

  const navigation = dashboard ? DASHBOARD_NAVIGATION : MAIN_NAVIGATION;

  return (
    <Box boxShadow="md">
      <Flex
        bg={dashboard ? 'qukBlue' : 'white'}
        color="greyDark"
        minH="60px"
        py={2}
        px={4}
        align="center"
        justifyContent="space-between"
        width="100%"
      >
        <Flex
          flex={{ base: 1, xl: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', xl: 'none' }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>

        <Flex
          justify={{ base: 'center', xl: 'space-between' }}
          direction="row"
          width="100%"
        >
          <NextLink href="/">
            <LogoLink onClick={onToggle}>
              <Logo
                src={logo}
                alt="Quidditch UK"
                filter={dashboard ? 'brightness(0) invert(1)' : 'inherit'}
              />
              <Logo
                src={logoText}
                alt="Quidditch UK"
                filter={dashboard ? 'brightness(0) invert(1)' : 'inherit'}
              />
            </LogoLink>
          </NextLink>

          <Flex
            display={{ base: 'none', xl: 'flex' }}
            alignItems={{ xl: 'center' }}
          >
            <DesktopNav navigation={navigation} dashboard={dashboard} />

            <Stack
              flex={{ base: 1, xl: 0 }}
              justify={'flex-end'}
              direction={'row'}
              spacing={3}
            >
              <Button
                variant={dashboard ? 'secondary' : 'primary'}
                href="/find-quidditch"
              >
                Find Quidditch
              </Button>

              <Button variant="light" href="login">
                Sign In
              </Button>
            </Stack>
          </Flex>
        </Flex>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav navigation={navigation} />
      </Collapse>
    </Box>
  );
}

const DesktopNav = ({ navigation, dashboard }) => {
  const { asPath } = useRouter();

  return (
    <Stack direction={'row'} spacing={3} mr={4}>
      {navigation.map((navItem) => {
        const regex = navItem?.path
          ? RegExp(navItem?.path.replace(/\//g, '\\/'), 'g')
          : RegExp(navItem?.href.replace(/\//g, '\\/'), 'g');
        const foundPath = navItem?.paths?.find((item) => item === asPath);

        const isActive = regex.test(asPath) || foundPath;

        return (
          <Box key={navItem.label}>
            <Popover trigger={'hover'} placement={'bottom-start'}>
              <PopoverTrigger>
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
                  <Link
                    px={2}
                    py={0}
                    fontSize={'md'}
                    fontWeight="bold"
                    color={
                      isActive ? 'monarchRed' : dashboard ? 'white' : 'greyDark'
                    }
                    _hover={{
                      textDecoration: 'none',
                      color: 'monarchRed',
                    }}
                  >
                    {navItem.label}
                  </Link>
                )}
              </PopoverTrigger>

              {navItem.children && (
                <PopoverContent
                  border={0}
                  boxShadow={'xl'}
                  bg={dashboard ? 'qukBlue' : 'white'}
                  p={4}
                  rounded={'xl'}
                  minW={'sm'}
                  color={dashboard ? 'white' : 'greyDark'}
                >
                  <Stack>
                    {navItem.children.map((child) => (
                      <DesktopSubNav key={child.label} {...child} />
                    ))}
                  </Stack>
                </PopoverContent>
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
        px={2}
        rounded={'md'}
        bg={isActive ? 'gray.200' : 'inherit'}
        _hover={{ bg: 'gray.200' }}
      >
        <Stack direction={'row'} align={'center'}>
          <Box>
            <Text
              transition={'all .3s ease'}
              color={isActive ? 'qukBlue' : 'inherit'}
              _groupHover={{ color: 'qukBlue' }}
              fontWeight={500}
            >
              {label}
            </Text>
          </Box>
          <Flex
            transition={'all .3s ease'}
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

const MobileNav = ({ navigation }) => {
  return (
    <Stack position="relative" bg="white" p={4} display={{ xl: 'none' }}>
      {navigation.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? '#'}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue('gray.600', 'gray.200')}
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align={'start'}
        >
          {children &&
            children.map((child) => (
              <Link key={child.label} py={2} href={child.href}>
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};
