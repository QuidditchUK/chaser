import { parse, format } from 'date-fns';
import { Box, Flex, Grid, Heading, Text } from '@chakra-ui/react';
import { formatMinorUnitsToCurrency } from 'modules/numbers';

const StyledCard = (props) => (
  <Grid
    borderRadius="md"
    overflow="hidden"
    transition="box-shadow 0.125s"
    bg="white"
    cursor="pointer"
    color="black"
    _hover={{ boxShadow: 'md' }}
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
          textDecoration: 'underline',
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
    gridTemplateColumns={{ base: '1fr', md: '3fr 6fr 3fr' }}
    gridGap={{ base: 4, md: 9 }}
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
      <Heading as="h2" fontSize="3xl" fontFamily="body">
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
          ? 'alert'
          : 'qukBlue'
      }
      color="white"
    >
      {!!price && (
        <Content fontSize="4">
          <strong>{formatMinorUnitsToCurrency(price?.unit_amount)}</strong>
        </Content>
      )}
      {!!expires && (
        <>
          <Content fontSize="1" py={0}>
            <strong>
              {parse(expires, 'dd-MM-yyyy', new Date()) > new Date()
                ? 'Valid until'
                : 'Expired'}
            </strong>
          </Content>
          <Content fontSize="3" py={0}>
            <strong>
              {format(parse(expires, 'dd-MM-yyyy', new Date()), 'd LLL yyyy')}
            </strong>
          </Content>
        </>
      )}
    </Flex>
  </StyledCard>
);

export default ProductCard;
