import { forwardRef } from 'react';
import {
  Button as ChakraButton,
  useStyleConfig,
  Box,
  Link as ChakraLink,
} from '@chakra-ui/react';
import Link from 'next/link';

const ExternalLink = ({ href, children, ...props }) => {
  const regex = new RegExp('(http)|(mailto)', 'g');

  return regex.test(href) ? (
    <ChakraLink
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </ChakraLink>
  ) : (
    <Link href={href} passHref>
      <ChakraLink {...props}>{children}</ChakraLink>
    </Link>
  );
};

export const ButtonStyles = {
  baseStyle: {
    borderRadius: 'base',
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: 'body',
    fontWeight: 'normal',
    textDecoration: 'none',
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
        textDecoration: 'none',
        _disabled: {
          bg: 'qukBlue',
        },
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
        textDecoration: 'none',
        _disabled: {
          bg: 'monarchRed',
        },
      },
    },
    light: {
      bg: 'white',
      border: '1px solid',
      borderColor: 'qukBlue',
      color: 'qukBlue',

      _hover: {
        bg: 'gray.200',
        textDecoration: 'none',
        _disabled: {
          bg: 'white',
        },
      },
    },
    white: {
      bg: 'white',
      border: '1px solid white',
      color: 'qukBlue',

      _hover: {
        bg: 'gray.200',
        textDecoration: 'none',
        _disabled: {
          bg: 'white',
        },
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
        textDecoration: 'none',
        _disabled: {
          bg: 'keeperGreen',
        },
      },
      _disabled: {
        bg: 'keeperGreen',
      },
    },
    transparent: {
      bg: 'transparent',
      border: '1px solid',
      borderColor: 'white',
      color: 'white',

      _hover: {
        bg: 'rgba(255,255,255,0.1)',
        textDecoration: 'none',
      },
    },
  },
  sizes: {
    sm: {
      fontSize: 'sm',
      py: 1,
      px: 2,
    },
    md: {
      fontSize: 'md',
      py: 2,
      px: 4,
    },
  },
  defaultProps: {
    variant: 'primary',
    size: 'md',
  },
};

const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', href, ...rest },
  ref
) {
  const styles = useStyleConfig('Button', { variant, size });
  const Wrapper = href ? ExternalLink : Box;

  return (
    <Wrapper
      href={href}
      textDecoration="none"
      _hover={{
        textDeoration: 'none',
      }}
    >
      <ChakraButton __css={styles} ref={ref} {...rest} />
    </Wrapper>
  );
});

export default Button;
