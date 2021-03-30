import Link from 'next/link';
import dynamic from 'next/dynamic';

import { Grid, Flex } from '@chakra-ui/react';

const Image = dynamic(() => import('components/image'));
const Card = dynamic(() => import('components/card'));
const StyledLink = dynamic(() =>
  import('components/latest-news').then(({ StyledLink }) => StyledLink)
);

const MIN_LENGTH = 3;

export const ClubNews = ({ posts, bgColor, color }) => {
  let spacers = [];

  if (posts.length < MIN_LENGTH) {
    spacers = new Array(MIN_LENGTH - posts.length).fill(0);
  }

  return (
    <Grid
      gridTemplateColumns={{
        base: '1fr',
        lg: 'repeat(auto-fit, minmax(150px, 1fr))',
      }}
      gridGap={{ base: 4, md: 9 }}
      pb={2}
    >
      {posts.map(({ uid, data }) => (
        <Flex flexDirection="column" key={uid}>
          <Link href="/news/[id]" as={`/news/${uid}`} passHref>
            <StyledLink>
              <Card
                sx={{
                  bg: bgColor,
                  color,
                  borderRadius: 'lg',
                  overflow: 'hidden',
                  transition: 'box-shadow 0.125s',
                  boxShadow: 'none',
                  height: '100%',
                  _hover: {
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
                  },
                }}
                name={data.title}
                category={data.category}
                image={
                  <Image
                    src={data.image.url}
                    alt={data.image.alt}
                    width={1600}
                    height={900}
                    borderRadius="0px"
                  />
                }
              />
            </StyledLink>
          </Link>
        </Flex>
      ))}
      {!!spacers.length &&
        spacers.map((space, i) => <div key={`spacer-${i}`} />)}
    </Grid>
  );
};

export default ClubNews;
