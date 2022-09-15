import { RichText } from 'prismic-reactjs';
import format from 'date-fns/format';
import {
  useStyleConfig,
  Box,
  Heading,
  Link as ChakraLink,
  GridItem,
  Grid,
  Text,
  Flex,
} from '@chakra-ui/react';
import { linkResolver } from 'modules/prismic';
import Image from 'next/image';

import Link from 'next/link';

export const CardStyles = {
  baseStyle: {
    borderRadius: 'xl',
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

export const NewsCard = ({
  image,
  title,
  content,
  variant,
  href,
  target,
  ariaLabel,
  date,
  bg,
  color,
  ...cardProps
}) => {
  const styles = useStyleConfig('Card', { variant });

  const Wrapper = href ? LinkWrapper : PlainWrapper;

  return (
    <Wrapper href={href} target={target} aria-label={ariaLabel} {...cardProps}>
      <Box
        __css={styles}
        as="article"
        bg={bg}
        height="100%"
        width="100%"
        overflow="hidden"
        position="relative"
        borderRadius="xl"
        {...cardProps}
      >
        <Image
          src={image?.src}
          alt={image?.alt}
          layout="responsive"
          objectFit="cover"
          width={640}
          height={700}
        />

        <Flex
          position="absolute"
          bottom="0"
          width="100%"
          height="70%"
          bgGradient={`linear(to-t, ${bg}, rgba(0, 0, 0, 0))`}
          color="white"
          px={{ base: 4, sm: 8, md: 9 }}
          py={4}
          flexDirection="column"
          justifyContent="flex-end"
        >
          {date && (
            <Text
              fontSize="sm"
              fontWeight="bold"
              textShadow="0 0 2px rgb(0,0,0)"
              mb={2}
            >
              {format(new Date(date), 'MMMM d, yyyy')}
            </Text>
          )}
          {title && (
            <Heading
              as="h2"
              fontSize="2xl"
              fontFamily="body"
              textShadow="0 0 4px rgb(0,0,0)"
              mt={0}
            >
              {title}
            </Heading>
          )}
        </Flex>
      </Box>
    </Wrapper>
  );
};

const Card = ({
  image,
  title,
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
      <Grid
        __css={styles}
        as="article"
        display="grid"
        height="100%"
        width="100%"
        overflow="hidden"
        position="relative"
        gridTemplateRows="min-content 1fr"
        {...cardProps}
      >
        {image?.src ? (
          <Image
            src={image?.src}
            alt={image?.alt}
            layout="responsive"
            objectFit="cover"
            width={640}
            height={700}
          />
        ) : (
          <Box />
        )}
        <Flex
          width="100%"
          height="100%"
          px={{ base: 4, sm: 8, md: 9 }}
          py={4}
          flexDirection="column"
          justifyContent={image?.src ? 'flex-start' : 'flex-end'}
        >
          <ContentBox
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
          >
            {title && (
              <Heading as="h2" fontSize="xl" fontFamily="body">
                {title}
              </Heading>
            )}
            {content && (
              <RichText render={content} linkResolver={linkResolver} />
            )}
          </ContentBox>
        </Flex>
      </Grid>
    </Wrapper>
  );
};

export default Card;
