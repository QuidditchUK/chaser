import format from 'date-fns/format';
import dynamic from 'next/dynamic';
import { Box, Flex, Grid, Heading, Text } from '@chakra-ui/react';
import { TYPES } from 'components/club-type';
import { rem } from 'styles/theme';

const Type = dynamic(() => import('components/club-type'));
const Image = dynamic(() => import('components/image'));

const StyledCard = (props) => (
  <Grid
    borderRadius="md"
    overflow="hidden"
    transition="box-shadow 0.125s"
    bg="white"
    color="black"
    _hover={{
      boxShadow: 'md',
    }}
    {...props}
  />
);

const IconContainer = (props) => <Box p={4} {...props} />;

const Icon = (props) => (
  <Image borderRadius="full" height={100} width={100} {...props} />
);

const Content = (props) => (
  <Box
    py={5}
    px={4}
    sx={{
      a: {
        textDecoration: 'none',
        color: 'black',
        _hover: { textDecoration: 'underline' },
      },
    }}
    {...props}
  />
);

const EventCard = ({
  image,
  name,
  leagues,
  icon,
  venue,
  startDate,
  endDate,
  ...cardProps
}) => (
  <StyledCard
    {...cardProps}
    gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }}
    gridGap={4}
    alignItems="center"
  >
    <Box
      as="section"
      position="relative"
      minHeight="200px"
      height="100%"
      width="100%"
    >
      <Image
        layout="fill"
        height={image.height}
        width={image.width}
        alt={image.alt}
        src={image.url}
        borderRadius="0"
        clipPath={{
          base: 'none',
          md: 'polygon(0 0, 100% 0, 90% 100%, 0 100%)',
        }}
      />

      <Flex
        position="absolute"
        bg={TYPES[leagues?.[0]?.league]}
        opacity={0.2}
        width="100%"
        height="100%"
        clipPath={{
          base: 'none',
          md: 'polygon(0 0, 100% 0, 90% 100%, 0 100%)',
        }}
      />

      <Flex
        position="relative"
        alignItems="center"
        justifyContent="center"
        height="100%"
      >
        <IconContainer>
          <Icon src={icon} alt={`${name} logo`} />
        </IconContainer>
      </Flex>
    </Box>

    <Content>
      {leagues?.map(({ league }) => (
        <Type
          key={league}
          fontWeight="bold"
          fontSize={rem(10)}
          bg={TYPES[league]}
          marginRight="1"
        >
          {league}
        </Type>
      ))}

      <Heading as="h2" fontSize="xl" fontFamily="body">
        {name}
      </Heading>
      <Text fontWeight="bold">
        {format(new Date(startDate), 'MMMM d, yyyy')}{' '}
        {startDate !== endDate && endDate !== null && (
          <> - {format(new Date(endDate), 'MMMM d, yyyy')}</>
        )}
      </Text>
      <Text>{venue}</Text>
    </Content>
  </StyledCard>
);

export default EventCard;
