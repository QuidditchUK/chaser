import dynamic from 'next/dynamic';
import { Link, Text } from '@chakra-ui/react';
const Alert = dynamic(() => import('components/alert'));

export default function PreviewAlert() {
  return (
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
  );
}
