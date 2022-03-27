import { forwardRef } from 'react';
import { Button as ChakraButton, useStyleConfig, Box } from '@chakra-ui/react';
import ExternalLink from 'components/external-link';

export const ButtonStyles = {
  baseStyle: {
    borderRadius: 'base',
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: 'body',
    fontWeight: 'normal',
    textDecoration: 'none',
    size: 'sm',
    alignItems: 'center',
    justifyContent: 'center',
    py: 2,
    px: 4,
  },
  variants: {
    primary: {
      bg: 'qukBlue',
      border: '1px solid',
      borderColor: 'qukBlue',
      color: 'white',

      _hover: {
        bg: '#092642',
        borderColor: '#092642',
      },
    },
    secondary: {
      bg: 'monarchRed',
      border: '1px solid',
      borderColor: 'monarchRed',
      color: 'white',

      _hover: {
        bg: '#7f131d',
        borderColor: '#7f131d',
      },
    },
    light: {
      bg: 'white',
      border: '1px solid',
      borderColor: 'qukBlue',
      color: 'qukBlue',

      _hover: {
        bg: 'gray.200',
      },
    },
    white: {
      bg: 'white',
      border: '1px solid white',
      color: 'qukBlue',

      _hover: {
        bg: 'gray.200',
      },
    },
    green: {
      bg: 'keeperGreen',
      border: '1px solid',
      borderColor: 'keeperGreen',
      color: 'white',

      _hover: {
        bg: '#247214',
        borderColor: '#247214',
      },
    },
    transparent: {
      bg: 'transparent',
      border: '1px solid',
      borderColor: 'white',
      color: 'white',

      _hover: {
        bg: 'rgba(255,255,255,0.1)',
      },
    },
  },
  defaultProps: {
    variant: 'primary',
  },
};

const Button = forwardRef(({ variant = 'primary', href, ...rest }, ref) => {
  const styles = useStyleConfig('Button', { variant });
  const Wrapper = href ? ExternalLink : Box;

  return (
    <Wrapper
      href={href}
      _hover={{
        textDeoration: 'none',
      }}
    >
      <ChakraButton __css={styles} ref={ref} {...rest} />
    </Wrapper>
  );
});

export default Button;
