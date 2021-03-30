import { useStyleConfig } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { Box } from '@chakra-ui/react';
import { rem } from 'styles/theme';
const Container = dynamic(() => import('components/container'));

export const PrismicStyles = {
  variants: {
    light: {
      color: 'darkBlue',
      bg: 'greyLight',
      a: {
        color: 'monarchRed',
      },
    },
    primary: {
      color: 'white',
      bg: 'qukBlue',
      a: {
        color: 'monarchRed',
      },
    },
    secondary: {
      color: 'white',
      bg: 'monarchRed',
      a: {
        color: 'darkBlue',
      },
    },
    white: {
      color: 'darkBlue',
      bg: 'white',
      a: {
        color: 'monarchRed',
      },
    },
    dark: {
      color: 'white',
      bg: 'darkBlue',
      a: {
        color: 'monarchRed',
      },
    },
  },

  defaultProps: {
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

export default function PrismicWrapper({
  variant = 'light',
  small = false,
  px,
  children,
}) {
  const styles = useStyleConfig('Prismic', { variant });
  return (
    <Box
      py={{ base: 4, lg: 5 }}
      px={px || { base: 4, sm: 8, md: 9 }}
      as="section"
      sx={styles}
    >
      <Container maxWidth={small ? rem(960) : rem(1280)}>{children}</Container>
    </Box>
  );
}
