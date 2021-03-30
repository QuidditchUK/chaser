import {
  Box,
  Flex,
  IconButton,
  Collapse,
  Link,
  useDisclosure,
} from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import Headroom from 'react-headroom';

import NextLink from 'next/link';

import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';

import { MAIN_NAVIGATION, DASHBOARD_NAVIGATION } from 'constants/navigation';

const logo = '/images/logo.png';
const logoText = '/images/logo-text.png';

const Logo = dynamic(() => import('components/logo').then(({ Logo }) => Logo));
const DesktopNav = dynamic(() => import('components/navigation/desktop'));
const DesktopCTAs = dynamic(() =>
  import('components/navigation/desktop').then(({ DesktopCTAs }) => DesktopCTAs)
);
const MobileNav = dynamic(() => import('components/navigation/mobile'));
// const Button = dynamic(() => import('components/button'));

export default function Navigation({
  dashboard = false,
  openCapeMode,
  capeModeIsOpen,
  closeCapeMode,
}) {
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
            <DesktopCTAs
              dashboard={dashboard}
              capeModeIsOpen={capeModeIsOpen}
              closeCapeMode={closeCapeMode}
              openCapeMode={openCapeMode}
            />
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
