import { Box } from '@chakra-ui/react';
import { rem } from 'styles/theme';

export default function Container(props) {
  return <Box my="0" mx="auto" maxWidth={rem(1280)} width="100%" {...props} />;
}
