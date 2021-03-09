import { forwardRef } from 'react';
import { Input as ChakraInput } from '@chakra-ui/react';

const Input = forwardRef(function Input(props, ref) {
  return (
    <ChakraInput
      ref={ref}
      bg="white"
      border="1px solid"
      borderColor={props.error ? 'monarchRed' : 'white'}
      p={2}
      color="qukBlue"
      fontSize="md"
      width="initial"
      {...props}
    />
  );
});

export default Input;
