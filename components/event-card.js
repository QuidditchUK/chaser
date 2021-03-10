import styled from '@emotion/styled';
import { space } from 'styled-system';
import { format } from 'date-fns';
import { parseTimestamptz } from 'modules/dates';
import { Box, Flex, Grid, Heading } from '@chakra-ui/react';
import Type, { TYPES } from 'components/club-type';
import { rem } from 'styles/theme';

const StyledCard = styled(Grid)`
  border-radius: ${({ theme }) => theme.radii[1]};
  overflow: hidden;
  transition: box-shadow 0.125s;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.black};

  ${space};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.box};
  }
`;

const IconContainer = styled.div`
  padding: ${({ theme }) => theme.space[4]};
`;

const Icon = styled.img`
  border-radius: 50%;
  height: 75px;
  width: 75px;
`;

const Content = styled.div`
  padding: ${({ theme }) => theme.space[5]} ${({ theme }) => theme.space[4]};

  a {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.black};

    &:hover {
      text-decoration: underline;
    }
  }
`;

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
