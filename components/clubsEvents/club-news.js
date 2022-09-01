import { NewsCard } from 'components/shared/card';
import { Grid, Flex } from '@chakra-ui/react';

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
          <NewsCard
            href={`/news/${uid}`}
            title={data.title}
            date={data?.date}
            bg={bgColor}
            color={color}
            image={{
              src: data.image.url,
              alt: data.image.alt,
              width: 640,
              height: 360,
            }}
          />
        </Flex>
      ))}
      {!!spacers.length &&
        spacers.map((space, i) => <div key={`spacer-${i}`} />)}
    </Grid>
  );
};

export default ClubNews;
