import { Box, Flex } from '@chakra-ui/react';
import { WarningIcon } from '@chakra-ui/icons';

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
    bg="red.50"
    px={4}
    py={1}
    borderColor="monarchRed"
    borderWidth="1px"
    borderStyle="solid"
    color="monarchRed"
    borderRadius="md"
  >
    <WarningIcon mr={3} /> <Box>{children}</Box>
  </Flex>
);

export default ErrorBanner;
