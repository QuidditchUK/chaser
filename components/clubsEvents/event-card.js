import format from 'date-fns/format';
import dynamic from 'next/dynamic';
import { Box, Flex, Heading, Text, useStyleConfig } from '@chakra-ui/react';
import { TYPES } from 'components/clubsEvents/league-type';
import { rem } from 'styles/theme';
import { LinkWrapper } from 'components/shared/card';

const Type = dynamic(() => import('components/clubsEvents/league-type'));
const Image = dynamic(() => import('components/shared/image'));

const IconContainer = (props) => <Box p={4} {...props} />;

const Icon = ({ alt, ...props }) => (
  <Image borderRadius="full" height={100} width={100} alt={alt} {...props} />
);

const Content = (props) => (
  <Box
    py={5}
    px={4}
    sx={{
      a: {
        textDecoration: 'none',
        color: 'black',
        _hover: { textDecoration: 'none' },
      },
    }}
    {...props}
  />
);

const EventCard = ({
  image,
  title,
  leagues,
  icon,
  venue,
  startDate,
  endDate,
  href,
  ...cardProps
}) => {
  const styles = useStyleConfig('HorizontalCard');
  return (
    <LinkWrapper
      href={href}
      aria-label={title}
      display="initial"
      {...cardProps}
    >
      <Box __css={styles} as="article">
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
              <Icon src={icon} alt={`${title} logo`} />
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
            {title}
          </Heading>
          <Text fontWeight="bold">
            {!!startDate && <>{format(new Date(startDate), 'MMMM d, yyyy')} </>}
            {startDate !== endDate && endDate !== null && (
              <> - {format(new Date(endDate), 'MMMM d, yyyy')}</>
            )}
          </Text>
          <Text>{venue}</Text>
        </Content>
      </Box>
    </LinkWrapper>
  );
};

export default EventCard;
