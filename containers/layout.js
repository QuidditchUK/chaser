import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { Link, Text, useDisclosure } from '@chakra-ui/react';

const Navigation = dynamic(() => import('components/navigation'));
const Footer = dynamic(() => import('components/footer'));
const Alert = dynamic(() => import('components/alert'));
const Cape = dynamic(() => import('components/cape'));

const Layout = ({ children, preview = false }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { asPath } = useRouter();
  const dashboard = RegExp(/\/dashboard/, 'g').test(asPath);

  return (
    <>
      {preview && (
        <Alert>
          <Text>
            This page is a preview.{' '}
            <Link
              color="white"
              fontWeight="bold"
              textDecoration="none"
              _hover={{ color: 'white', borderBottom: '2px solid white' }}
              href="/api/exit-preview"
            >
              Click here
            </Link>{' '}
            to exit preview mode.
          </Text>
        </Alert>
      )}

      <Navigation
        dashboard={dashboard}
        capeModeIsOpen={isOpen}
        openCapeMode={onOpen}
        closeCapeMode={onClose}
      />
      {isOpen && <Cape />}

      {children}
      <Footer />
    </>
  );
};

export default Layout;
