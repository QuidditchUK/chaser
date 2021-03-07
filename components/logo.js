import { Link as ChakraLink, Image } from 'components';

export const LogoLink = (props) => (
  <ChakraLink height={{ base: '35px', xl: '45px' }} {...props} />
);
export const Logo = (props) => (
  <Image height={{ base: '35px', xl: '45px' }} {...props} />
);
