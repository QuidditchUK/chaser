import { useMultiStyleConfig, StylesProvider } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';

export const SliceStyles = {
  parts: ['slice', 'container'],
  baseStyle: {
    slice: {
      a: {
        fontWeight: 'bold',
        textDecoration: 'none',
        color: 'qukBlue',
        _hover: {
          textDecoration: 'underline',
          color: 'qukBlue',
        },
      },
    },
  },
  sizes: {
    sm: {
      container: {
        maxWidth: '768px',
      },
    },
    md: {
      container: {
        maxWidth: '1280px',
      },
    },
    full: {
      container: {
        maxWidth: '100%',
        px: 0,
      },
    },
  },
  variants: {
    light: {
      color: 'darkBlue',
      bg: 'greyLight',
      '& a': {
        fontWeight: 'bold',
        textDecoration: 'none',
        color: 'monarchRed',

        _hover: {
          textDecoration: 'underline',
          color: 'monarchRed',
        },
      },
    },
    primary: {
      color: 'white',
      bg: 'qukBlue',
      '& a': {
        fontWeight: 'bold',
        textDecoration: 'none',
        color: 'monarchRed',

        _hover: {
          textDecoration: 'underline',
          color: 'monarchRed',
        },
      },
    },
    secondary: {
      color: 'white',
      bg: 'monarchRed',
      '& a': {
        fontWeight: 'bold',
        textDecoration: 'none',
        color: 'darkBlue',

        _hover: {
          textDecoration: 'underline',
          color: 'darkBlue',
        },
      },
    },
    white: {
      color: 'darkBlue',
      bg: 'white',
      '& a': {
        fontWeight: 'bold',
        textDecoration: 'none',
        color: 'monarchRed',

        _hover: {
          textDecoration: 'underline',
          color: 'monarchRed',
        },
      },
    },
    dark: {
      color: 'white',
      bg: 'darkBlue',
      '& a': {
        fontWeight: 'bold',
        textDecoration: 'none',
        color: 'monarchRed',

        _hover: {
          textDecoration: 'underline',
          color: 'monarchRed',
        },
      },
    },
  },

  defaultProps: {
    size: 'md',
    variant: 'primary',
  },
};

export const buttonVariants = {
  light: 'primary',
  primary: 'white',
  secondary: 'white',
  white: 'primary',
  dark: 'secondary',
};

export const cardVariants = {
  light: 'white',
  primary: 'white',
  secondary: 'white',
  white: 'primary',
  dark: 'white',
};

export default function Slice({
  variant = 'light',
  size = 'md',
  children,
  px,
}) {
  const styles = useMultiStyleConfig('Slice', { size, variant });
  return (
    <Box
      __css={styles}
      py={{ base: 4, lg: 5 }}
      px={px || { base: 4, sm: 8, md: 9 }}
      as="section"
    >
      <Box width="100%" my="0" mx="auto" sx={styles.container}>
        <StylesProvider value={styles}>{children}</StylesProvider>
      </Box>
    </Box>
  );
}
