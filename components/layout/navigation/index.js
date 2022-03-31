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
import { useRouter } from 'next/router';

import NextLink from 'next/link';

import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';

import { MAIN_NAVIGATION, DASHBOARD_NAVIGATION } from 'constants/navigation';

const Logo = dynamic(() => import('components/shared/logo'));
const DesktopNav = dynamic(() =>
  import('components/layout/navigation/desktop')
);
const DesktopCTAs = dynamic(() =>
  import('components/layout/navigation/desktop').then(
    ({ DesktopCTAs }) => DesktopCTAs
  )
);
const MobileNav = dynamic(() => import('components/layout/navigation/mobile'));

export default function Navigation() {
  const { asPath } = useRouter();
  const dashboard = RegExp(/\/dashboard/, 'g').test(asPath);

  const { isOpen, onToggle: closeTopNav, onClose } = useDisclosure();
  const navigation = dashboard ? DASHBOARD_NAVIGATION : MAIN_NAVIGATION;

  return (
    <Box as={Headroom} flexShrink="0">
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
            <Link
              height={{ base: '35px', xl: '45px' }}
              onClick={onClose}
              display="flex"
              alignItems="center"
            >
              <Logo filter={dashboard} />
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
