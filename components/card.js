import { RichText } from 'prismic-reactjs';
import CATEGORIES from 'constants/categories';
import { Heading, Text, Box } from 'components';
import { rem } from 'styles/theme';
import { linkResolver } from 'modules/prismic';

const StyledCard = (props) => (
  <Box
    borderRadius="lg"
    display="flex"
    flexDirection="column"
    flexGrow="1"
    overflow="hidden"
    position="relative"
    transition="box-shadow 0.125s"
    boxShadow="none"
    _hover={{
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
    }}
    bg="white"
    color="qukBlue"
    {...props}
  />
);

const ContentBox = (props) => (
  <Box
    sx={{
      a: {
        textDecoration: 'none',
        '&:hover': {
          textDecoration: 'underline',
        },
      },
    }}
    {...props}
  />
);

const Card = ({ image, name, category, content, ...cardProps }) => (
  <StyledCard {...cardProps}>
    {image ? <Box position="relative">{image}</Box> : null}

    <ContentBox py={5} px={4}>
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

      {name && (
        <Heading as="h2" fontSize="xl" fontFamily="body">
          {name}
        </Heading>
      )}
      {content && <>{RichText.render(content, linkResolver)}</>}
    </ContentBox>
  </StyledCard>
);

export default Card;
