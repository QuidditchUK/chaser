import { Flex } from 'components';
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
