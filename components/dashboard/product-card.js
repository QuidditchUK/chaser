import parse from 'date-fns/parse';
import Link from 'next/link';
import format from 'date-fns/format';
import {
  Box,
  Flex,
  Grid,
  Heading,
  Text,
  useStyleConfig,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { formatMinorUnitsToCurrency } from 'modules/numbers';
import Image from 'next/image';
import { PlainWrapper } from 'components/shared/card';
import Button from 'components/shared/button';

const StyledCard = ({ onClick, ...props }) => (
  <Grid
    borderRadius="md"
    overflow="hidden"
    transition="box-shadow 0.125s"
    bg="white"
    cursor={onClick ? 'pointer' : 'initial'}
    color="black"
    {...(onClick && { _hover: { boxShadow: 'md' }, onClick })}
    {...props}
  />
);

const Content = (props) => (
  <Box
    py={5}
    px={4}
    sx={{
      a: {
        textDecoration: 'none',
        color: 'black',
        '&:hover': {
          textDecoration: 'none',
        },
      },
    }}
    {...props}
  />
);

const ProductCard = ({
  image,
  name,
  description,
  price,
  expires,
  ...cardProps
}) => (
  <StyledCard
    {...cardProps}
    gridTemplateColumns={{ base: '1fr', lg: '3fr 6fr 3fr' }}
    gridGap={{ base: 2, lg: 9 }}
  >
    <Box
      as="section"
      position="relative"
      backgroundImage={`url(${image})`}
      backgroundColor="white"
      backgroundSize="contain"
      backgroundRepeat="no-repeat"
      backgroundPosition="center"
      minHeight="100px"
    />

    <Content>
      <Heading as="h2" fontSize="xl" fontFamily="body" mt={2}>
        {name}
      </Heading>
      <Text>{description}</Text>
    </Content>

    <Flex
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      padding="3"
      bg={
        expires && parse(expires, 'dd-MM-yyyy', new Date()) < new Date()
          ? 'monarchRed'
          : 'qukBlue'
      }
      clipPath={{
        base: 'none',
        lg: 'polygon(10% 0, 100% 0, 100% 100%, 0 100%)',
      }}
      color="white"
    >
      {!!price && (
        <Content fontSize="xl">
          <strong>{formatMinorUnitsToCurrency(price?.unit_amount)}</strong>
        </Content>
      )}
      {!!expires && (
        <>
          <Content fontSize="md" py={0}>
            <strong>
              {parse(expires, 'dd-MM-yyyy', new Date()) > new Date()
                ? 'Valid until'
                : 'Expired'}
            </strong>
          </Content>
          <Content fontSize="lg" py={0}>
            <strong>
              {format(parse(expires, 'dd-MM-yyyy', new Date()), 'd LLL yyyy')}
            </strong>
          </Content>
        </>
      )}
    </Flex>
  </StyledCard>
);

export const ProductCardV2 = ({
  image,
  name,
  description,
  price,
  expires,
  ...props
}) => {
  const isValid = parse(expires, 'dd-MM-yyyy', new Date()) > new Date();

  const styles = useStyleConfig('Card', { variant: 'white' });

  return (
    <PlainWrapper flexDirection="column" {...props}>
      <Box
        __css={styles}
        as="article"
        bg="qukBlue"
        height="100%"
        width="100%"
        overflow="hidden"
        position="relative"
        borderRadius="xl"
        {...props}
      >
        <Image
          src={image}
          alt={description}
          role="description"
          layout="fill"
          objectFit="cover"
        />
        <Box
          position="absolute"
          bottom="0"
          width="100%"
          height="100%"
          opacity={0.8}
          bg="qukBlue"
          color="white"
        />
        <Flex
          position="absolute"
          bottom="0"
          width="100%"
          height="100%"
          bgGradient={`linear(to-tl, ${
            isValid ? 'northernMagenta' : 'monarchRed'
          }, rgba(0, 0, 0, 0))`}
          color="white"
          px={{ base: 4, sm: 8, md: 9 }}
          py={4}
          flexDirection="column"
          justifyContent="center"
          textAlign="center"
        >
          <Heading
            as="h2"
            fontSize="2xl"
            fontFamily="body"
            textShadow="0 0 4px rgb(0,0,0)"
            mb={0}
          >
            {name}
          </Heading>

          {isValid && (
            <Text
              fontSize="sm"
              fontWeight="bold"
              textShadow="0 0 2px rgb(0,0,0)"
              my={2}
            >
              {description}
            </Text>
          )}

          {!isValid && (
            <Link href="/dashboard/membership/manage" passHref>
              <ChakraLink>
                <Button variant="transparent" mt={2}>
                  Renew your Quidditch UK Membership
                </Button>
              </ChakraLink>
            </Link>
          )}
        </Flex>

        <Flex
          bg={isValid ? 'qukBlue' : 'monarchRed'}
          width="100%"
          overflow="hidden"
          alignItems="center"
          position="absolute"
          bottom="0"
          justifyContent="center"
        >
          <Text
            fontSize="md"
            fontWeight="bold"
            color="white"
            textAlign="center"
          >
            {isValid ? 'Valid until' : 'Expired'}{' '}
            {format(parse(expires, 'dd-MM-yyyy', new Date()), 'd LLL yyyy')}
          </Text>
        </Flex>
      </Box>
    </PlainWrapper>
  );
};

export default ProductCard;
