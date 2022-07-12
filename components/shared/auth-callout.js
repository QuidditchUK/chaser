import { Box } from '@chakra-ui/react';
import Content from 'components/shared/content';

const AuthCallout = ({ children }) => (
  <Box
    bg="white"
    px="4"
    py="2"
    mt="6"
    borderColor="qukBlue"
    borderWidth="1px"
    borderStyle="solid"
    color="qukBlue"
    borderRadius="sm"
  >
    <Content>{children}</Content>
  </Box>
);

export default AuthCallout;
