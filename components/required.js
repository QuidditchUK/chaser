import { Box } from '@chakra-ui/react';

export default function Required() {
  return (
    <Box as="span" fontWeight="bold" color="monarchRed">
      *
    </Box>
  );
}
