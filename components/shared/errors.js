import { Box, Flex, Text } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

const Error = (props) => (
  <Box display="block" color="monarchRed" fontSize="sm" {...props} />
);

export const InlineError = ({ children, ...errorProps }) => (
  <Error {...errorProps}>
    <span>{children}</span>
  </Error>
);

export const ErrorBanner = ({ children }) => (
  <Flex
    alignItems="center"
    bg="monarchRed"
    px={4}
    py={1}
    mt={6}
    borderColor="monarchRed"
    borderWidth="1px"
    borderStyle="solid"
    color="white"
    borderRadius="md"
  >
    <CloseIcon mr={3} /> <Text fontWeight="bold">{children}</Text>
  </Flex>
);

export default ErrorBanner;
