import { RichText } from 'prismic-reactjs';
import CATEGORIES from 'constants/categories';
import { rem } from 'styles/theme';
import {
  useStyleConfig,
  Box,
  Heading,
  Link as ChakraLink,
  GridItem,
  Text,
} from '@chakra-ui/react';
import { linkResolver } from 'modules/prismic';
import Image from 'next/image';

import Link from 'next/link';

export const CardStyles = {
  baseStyle: {
    borderRadius: 'lg',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: '1',
    overflow: 'hidden',
  },
  variants: {
    white: {
      bg: 'white',
      color: 'qukBlue',
    },
    primary: {
      bg: 'qukBlue',
      color: 'white',
    },
  },
  defaultProps: {
    variant: 'white',
  },
};

export const cardVariants = {
  white: 'primary',
  primary: 'white',
};

export const ContentBox = (props) => (
  <Box
    textDecoration="none"
    _hover={{ textDecoration: 'none' }}
    lineHeight="24px"
    sx={{
      a: {
        textDecoration: 'none',
        '&:hover': {
          textDecoration: 'none',
        },
      },
    }}
    {...props}
  />
);

export const LinkWrapper = ({ href, ...props }) => (
  <Link href={href} passHref>
    <GridItem
      as={ChakraLink}
      cursor="pointer"
      boxShadow="md"
      transition="all 0.2s ease"
      fontWeight="normal !important"
      _hover={{
        transform: 'scale(1.03)',
        boxShadow: 'lg',
        textDecoration: 'none !important',
      }}
      _focus={{
        transform: 'scale(1.03)',
        boxShadow: 'lg',
        textDecoration: 'none',
        ringWidth: '2px',
        ringColor: 'monarchRed',
      }}
      _active={{ transform: 'scale(1)' }}
      borderRadius="2xl"
      flexGrow={1}
      display="flex"
      {...props}
    />
  </Link>
);

export const PlainWrapper = (props) => (
  <GridItem display="flex" flexGrow={1} {...props} />
);

const Card = ({
  image,
  title,
  category,
  videoContent,
  content,
  variant,
  href,
  target,
  ariaLabel,
  ...cardProps
}) => {
  const styles = useStyleConfig('Card', { variant });

  const Wrapper = href ? LinkWrapper : PlainWrapper;

  return (
    <Wrapper href={href} target={target} aria-label={ariaLabel} {...cardProps}>
      <Box __css={styles} as="article" {...cardProps}>
        <Box
          position="relative"
          height={{ base: '100%', md: 'auto' }}
          width={{ base: '100%', md: 'auto' }}
          overflow="hidden"
        >
          {image?.src && (
            <Image
              src={image?.src}
              alt={image?.alt}
              layout="responsive"
              objectFit="cover"
              width={640}
              height={360}
            />
          )}
        </Box>
        <ContentBox
          py={5}
          px={4}
          flexGrow="1"
          sx={{
            '& a': {
              fontWeight: 'bold',
              color: 'qukBlue',
              textDecoration: 'none',
              _hover: {
                textDecoration: 'underline',
              },
            },
          }}
          {...(category && {
            borderBottomWidth: '12px',
            borderBottomStyle: 'solid',
            borderBottomColor: CATEGORIES[category],
          })}
        >
          {category && (
            <Text
              as="span"
              fontWeight="bold"
              color="white"
              textTransform="uppercase"
              borderRadius="lg"
              py={1}
              px={2}
              fontSize={rem(10)}
              bg={CATEGORIES[category]}
            >
              {category}
            </Text>
          )}

          {title && (
            <Heading as="h2" fontSize="xl" fontFamily="body">
              {title}
            </Heading>
          )}
          {content && <RichText render={content} linkResolver={linkResolver} />}
          {videoContent && <>{videoContent}</>}
        </ContentBox>
      </Box>
    </Wrapper>
  );
};

export default Card;
