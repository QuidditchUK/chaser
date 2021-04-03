import format from 'date-fns/format';
import dynamic from 'next/dynamic';
import { parseTimestamptz } from 'modules/dates';
import { Box, Flex, Grid, Heading } from '@chakra-ui/react';
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
  <Image borderRadius="full" height={75} width={75} {...props} />
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
  league,
  icon,
  venue,
  startTime,
  ...cardProps
}) => (
  <StyledCard
    {...cardProps}
    gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }}
    gridGap={4}
  >
    <Box
      as="section"
      position="relative"
      backgroundImage={`url(${image})`}
      backgroundColor="qukBlue"
      backgroundSize="cover"
      backgroundPosition="center"
    >
      <Flex
        position="absolute"
        bg={TYPES[league[0]]}
        opacity={0.2}
        width="100%"
        height="100%"
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
      {league.map((leag) => (
        <Type
          key={leag}
          fontWeight="bold"
          fontSize={rem(10)}
          bg={TYPES[leag]}
          marginRight="1"
        >
          {leag}
        </Type>
      ))}

      <Heading as="h2" fontSize={3} fontFamily="body">
        {name}
      </Heading>
      <p>
        <strong>
          {format(parseTimestamptz(startTime), 'EEE, d LLL H:mm a')}
        </strong>
        <br />
        {venue}
      </p>
    </Content>
  </StyledCard>
);

export default EventCard;
