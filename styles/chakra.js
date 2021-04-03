import { ChakraProvider } from '@chakra-ui/react';
import theme from 'styles/theme';

export function Chakra({ children }) {
  return (
    <ChakraProvider theme={theme} resetCSS={false}>
      {children}
    </ChakraProvider>
  );
}
