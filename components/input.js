import { Input as ChakraInput } from 'components';

export default function Input(props) {
  return (
    <ChakraInput
      bg="white"
      border="1px solid"
      p={2}
      color="qukBlue"
      fontSize="md"
      width="initial"
      {...props}
    />
  );
}
