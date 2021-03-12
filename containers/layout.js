import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { Link, Text } from '@chakra-ui/react';

const Navigation = dynamic(() => import('components/navigation'));
const Footer = dynamic(() => import('components/footer'));
const Alert = dynamic(() => import('components/alert'));

const Layout = ({ children, preview = false }) => {
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

      <Navigation dashboard={dashboard} />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
