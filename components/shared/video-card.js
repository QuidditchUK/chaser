import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Heading,
  Flex,
  Text,
  Table,
  Tbody,
  Td,
  Tr,
  Stack,
  Box,
} from '@chakra-ui/react';
import DescriptionList, { Description } from './description-list';

import { useInView } from 'react-intersection-observer';
import axios from 'axios';

const Button = dynamic(() => import('components/shared/button'));
const Embed = dynamic(() =>
  import('components/prismic/embeds').then(({ Embed }) => Embed)
);

export const ContentBox = (props) => (
  <Box
    textDecoration="none"
    _hover={{ textDecoration: 'none' }}
    lineHeight="24px"
    sx={{
      a: {
        textDecoration: 'none',
        '&:hover': {
          textDecoration: 'none',
        },
      },
    }}
    {...props}
  />
);

const Card = ({ embed, content }) => (
  <Box
    as="article"
    borderRadius="lg"
    display="flex"
    flexDirection="column"
    flexGrow="1"
    overflow="hidden"
    bg="white"
  >
    <Box
      position="relative"
      height={{ base: '100%', md: 'auto' }}
      width={{ base: '100%', md: 'auto' }}
      overflow="hidden"
    >
      {embed}
    </Box>
    <ContentBox
      py={5}
      px={4}
      flexGrow="1"
      sx={{
        '& a': {
          fontWeight: 'bold',
          color: 'qukBlue',
          textDecoration: 'none',
          _hover: {
            textDecoration: 'underline',
          },
        },
      }}
    >
      {content}
    </ContentBox>
  </Box>
);

const VideoCard = ({ video }) => {
  const [ref, inView] = useInView({ threshold: 0 });
  const [videoLink, setVideoLink] = useState(video.Link);
  const youRegex = new RegExp('youtu', 'gi');
  const faceRegex = new RegExp('facebook.com', 'gi');
  const fbRegex = new RegExp('fb.watch', 'gi');
  const linkRegex = new RegExp('http', 'gi');

  const videos = [
    video.Link,
    video.Notes,
    video['Notes 1'],
    video['Notes 2'],
    video['Notes 3'],
    video['Notes 4'],
  ].filter((value) => linkRegex.test(value));

  const isFacebook = faceRegex.test(videoLink) || fbRegex.test(videoLink);

  const isYoutube = youRegex.test(videoLink);
  const [oembed, setOembed] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchYoutubeOembed = async () => {
      const [url] = videoLink.split('/').slice(-1);
      const [videoId, timestamp] = url.split('?t=');

      try {
        const oemebedDetails = await axios.get(
          `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}${
            timestamp !== undefined ? `%26t%3D${timestamp}` : ''
          }`
        );

        if (timestamp) {
          console.log(oemebedDetails);
        }
        setOembed(oemebedDetails);
      } catch (err) {
        if (err?.response?.status !== 400) {
          console.log(err);
        }
      }
    };

    const fetchFacebookOembed = () => {
      const oembedDetails = {
        data: { provider_name: 'Facebook', href: videoLink },
      };
      setOembed(oembedDetails);
    };

    if (inView) {
      const timeout = setTimeout(() => {
        if (isYoutube && (!oembed || loading)) {
          fetchYoutubeOembed();
          setLoading(false);
        }

        if (isFacebook && (!oembed || loading)) {
          fetchFacebookOembed();
          setLoading(false);
        }
      }, 500);
      return () => clearTimeout(timeout);
    }

    return undefined;
  }, [isYoutube, isFacebook, videoLink, oembed, inView, setLoading, loading]);

  return (
    <Flex flexDirection="column" ref={ref}>
      <Card
        embed={oembed?.data && !loading ? <Embed embed={oembed?.data} /> : null}
        content={
          <>
            <Heading as="h2" fontFamily="body" textAlign="center" fontSize="xl">
              {video['Team 1']} vs {video['Team 2']}
            </Heading>
            <Text fontWeight="bold" textAlign="center">
              {video.Score}
            </Text>

            <DescriptionList>
              <Description term="Event" description={video.Tournament} />
              <Description term="Credit" description={video.Credit} />
            </DescriptionList>

            {videos.length !== 1 && (
              <Stack direction="row" spacing={2} pt={3}>
                {videos.map((videoLink, i) => (
                  <Button
                    size="sm"
                    onClick={() => {
                      setLoading(true);
                      setVideoLink(videoLink);
                    }}
                    key={`video-link-${videoLink}`}
                  >
                    Video {i + 1}
                  </Button>
                ))}
              </Stack>
            )}
          </>
        }
      />
    </Flex>
  );
};

export default VideoCard;
