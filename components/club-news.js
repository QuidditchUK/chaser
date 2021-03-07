import Link from 'next/link';

import { Grid, Flex } from 'components';
import Card from 'components/card';
import Image from 'components/image';
import { StyledLink } from 'components/latest-news';

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
                color={color}
                bg={bgColor}
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
