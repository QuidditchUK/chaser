import { Box } from '@chakra-ui/react';

export default function Notification(props) {
  return (
    <Box
      bg="gray.200"
      border="1px solid"
      borderColor="qukBlue"
      borderRadius="md"
      pt={2}
      px={4}
      pb={4}
      color="qukBlue"
      {...props}
    />
  );
}
