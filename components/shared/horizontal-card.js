import { RichText } from 'prismic-reactjs';
import Link from 'next/link';
import {
  Heading,
  Box,
  useStyleConfig,
  GridItem,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { linkResolver } from 'modules/prismic';

import Image from 'components/shared/image';

export const HorizontalCardStyles = {
  baseStyle: {
    borderRadius: 'lg',
    display: 'grid',
    gridTemplateColumns: { base: '1fr', md: '1fr 1fr' },
    gridGap: 4,
    gridTemplateAreas: { base: "'image' 'content'", md: "'image content'" },
    overflow: 'hidden',
    alignItems: 'center',
  },
  variants: {
    white: {
      bg: 'gray.50',
      color: 'gray.800',
    },
    primary: {
      bg: 'gray.50',
      color: 'gray.800',
    },
  },
  defaultProps: {
    variant: 'primary',
  },
};

const ContentBox = (props) => (
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

const LinkWrapper = ({ href, ...props }) => (
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

const PlainWrapper = (props) => (
  <GridItem display="flex" flexGrow={1} {...props} />
);

const HorizontalCard = ({
  image,
  title,
  href,
  target,
  ariaLabel,
  content,
  isImageLeft,
  variant,
  ...cardProps
}) => {
  const styles = useStyleConfig('HorizontalCard', { variant });
  const gridAreas = isImageLeft
    ? {}
    : {
        gridTemplateAreas: image?.src
          ? { base: "'image' 'content'", md: "'content image'" }
          : { base: "'content'", md: "'content content'" },
      };

  const clipPath = isImageLeft
    ? 'polygon(0 0, 100% 0, 90% 100%, 0 100%)'
    : 'polygon(10% 0, 100% 0, 100% 100%, 0 100%)';

  const Wrapper = href ? LinkWrapper : PlainWrapper;

  return (
    <Wrapper
      href={href}
      target={target}
      aria-label={ariaLabel}
      display="initial"
      {...cardProps}
    >
      <Box __css={styles} as="article" {...gridAreas}>
        <Box
          position="relative"
          bg="grey.100"
          minHeight={image?.src ? '300px' : 'initial'}
          display={image?.src ? 'block' : 'none'}
          height="100%"
          width="100%"
          overflow="hidden"
          gridArea="image"
        >
          {image?.src && (
            <Image
              layout="fill"
              height={image?.height}
              width={image?.width}
              alt={image?.alt}
              src={image?.src}
              borderRadius={0}
              clipPath={{ base: 'none', md: clipPath }}
            />
          )}
        </Box>
        <ContentBox
          py={5}
          pl={isImageLeft ? 4 : 8}
          pr={isImageLeft ? 8 : 4}
          gridArea="content"
          minHeight={image?.src ? 'initial' : '300px'}
          color="qukBlue"
          sx={{
            '& a': {
              fontWeight: 'bold',
              color: 'qukBlue',
              textDecoration: 'none',
              _hover: {
                textDecoration: 'none',
              },
            },
          }}
        >
          {title && (
            <Heading as="h2" fontSize="xl" fontFamily="body">
              {title}
            </Heading>
          )}
          {content && <RichText render={content} linkResolver={linkResolver} />}
        </ContentBox>
      </Box>
    </Wrapper>
  );
};

export default HorizontalCard;
