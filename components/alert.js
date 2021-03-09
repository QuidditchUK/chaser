import { Flex } from '@chakra-ui/react';
import Container from 'components/container';

export default function Alert({ children }) {
  return (
    <Flex
      bg="monarchRed"
      py="4"
      alignItems="center"
      justifyContent="center"
      color="white"
      textAlign="center"
    >
      <Container>{children}</Container>
    </Flex>
  );
}
