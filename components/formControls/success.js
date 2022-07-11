import { Flex, Text } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';

const Success = ({ children }) => {
  return (
    <Flex
      alignItems="center"
      bg="keeperGreen"
      px={4}
      py={1}
      mt={6}
      borderColor="keeperGreen"
      borderWidth="1px"
      borderStyle="solid"
      color="white"
      borderRadius="md"
    >
      <CheckIcon mr={3} /> <Text fontWeight="bold">{children}</Text>
    </Flex>
  );
};

export default Success;
