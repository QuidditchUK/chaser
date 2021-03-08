import { forwardRef } from 'react';
import { Textarea as ChakraTextarea } from 'components';

const Textarea = forwardRef(function Textarea(props, ref) {
  return (
    <ChakraTextarea
      ref={ref}
      bg="white"
      p={2}
      color="qukBlue"
      border="1px solid"
      borderColor={props.error ? 'monarchRed' : 'white'}
      fontSize="md"
      width="initial"
      {...props}
    />
  );
});

export default Textarea;
