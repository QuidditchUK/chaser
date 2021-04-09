import { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import {
  Heading,
  Flex,
  Text,
  Box,
  Table,
  Tbody,
  Td,
  Tr,
  Grid,
  useDisclosure,
  Collapse,
} from '@chakra-ui/react';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';
import getSheet from 'modules/sheets';
import { BLOG_MIN_HEIGHTS } from 'styles/hero-heights';
import PrismicWrapper from 'components/prismic-wrapper';

const Image = dynamic(() => import('components/image'));
const Page404 = dynamic(() => import('pages/404'));
const PageLoading = dynamic(() => import('components/page-loading'));
const Meta = dynamic(() => import('components/meta'));
const Card = dynamic(() => import('components/card'));
const Content = dynamic(() => import('components/content'));
const Button = dynamic(() => import('components/button'));
const Embed = dynamic(() =>
  import('components/embed-slice').then(({ Embed }) => Embed)
);

const persicopeRegex = new RegExp('periscope', 'gi');

const isPericope = (video) => {
  return persicopeRegex.test(video.Link);
};

const VideoCard = ({ video }) => {
  const [ref, inView] = useInView({ threshold: 0 });
  const youRegex = new RegExp('youtu', 'gi');
  const faceRegex = new RegExp('facebook.com', 'gi');
  const fbRegex = new RegExp('fb.watch', 'gi');

  const isFacebook = faceRegex.test(video.Link) || fbRegex.test(video.Link);

  const isYoutube = youRegex.test(video.Link);
  const [oembed, setOembed] = useState(null);

  useEffect(() => {
    const fetchYoutubeOembed = async () => {
      const [url] = video.Link.split('/').slice(-1);

      try {
        const oemebedDetails = await axios.get(
          `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${url}&format=json`
        );
        setOembed(oemebedDetails);
      } catch (err) {
        if (err?.response?.status !== 400) {
          console.log(err);
        }
      }
    };

    const fetchFacebookOembed = () => {
      const oembedDetails = {
        data: { provider_name: 'Facebook', href: video.Link },
      };
      setOembed(oembedDetails);
    };

    if (isYoutube && !oembed && inView) {
      fetchYoutubeOembed();
    }

    if (isFacebook && !oembed && inView) {
      fetchFacebookOembed();
    }
  }, [isYoutube, isFacebook, video.Link, oembed, inView]);

  return (
    <Flex flexDirection="column" ref={ref}>
      <Card
        image={oembed?.data ? <Embed embed={oembed?.data} /> : null}
        videoContent={
          <>
            <Heading as="h2" fontFamily="body" textAlign="center" fontSize="xl">
              {video['Team 1']} vs {video['Team 2']}
            </Heading>
            <Text fontWeight="bold" textAlign="center">
              {video.Score}
            </Text>
            <Table variant="unstyled" mx={0}>
              <Tbody>
                <Tr>
                  <Td fontWeight="bold" py={0} px={2}>
                    Tournament
                  </Td>
                  <Td py={0} px={2}>
                    {video.Tournament}
                  </Td>
                </Tr>
                <Tr>
                  <Td fontWeight="bold" py={0} px={2}>
                    Credit
                  </Td>
                  <Td py={0} px={2}>
                    {video.Credit}
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </>
        }
      />
    </Flex>
  );
};

const Page = ({ data }) => {
  const router = useRouter();
  const { isOpen, onToggle } = useDisclosure();

  if (router.isFallback && !data) {
    return <PageLoading />;
  }

  if (!data) {
    return <Page404 />;
  }

  return (
    <>
      <Meta
        subTitle="Video Library"
        image="https://images.prismic.io/chaser/15de9370-f5bd-4a7c-8b4d-9610e0b22e3b_video-uncropped.jpg?auto=compress,format"
        description="Browse the QuidditchUK Community Video Library for footage of Quidditch being played in the UK"
      />
      <Box
        as="section"
        position="relative"
        backgroundColor="qukBlue"
        backgroundSize="cover"
        overflow="hidden"
        minHeight={BLOG_MIN_HEIGHTS}
      >
        <Image
          src="https://images.prismic.io/chaser/15de9370-f5bd-4a7c-8b4d-9610e0b22e3b_video-uncropped.jpg?auto=compress,format"
          layout="fill"
          objectPosition="center center"
          objectFit="cover"
          borderRadius={0}
          priority={true}
        />
        <Flex
          position="absolute"
          minHeight={BLOG_MIN_HEIGHTS}
          bg="qukBlue"
          opacity={0.8}
          width="100%"
          height="100%"
        />

        <Flex
          position="relative"
          minHeight={BLOG_MIN_HEIGHTS}
          direction="column"
          alignItems="center"
          justifyContent="center"
          bgGradient={
            isOpen ? 'linear(to-t, qukBlue, rgba(0, 0, 0, 0))' : 'none'
          }
        >
          <Heading
            fontSize={{ base: '4xl', md: '7xl' }}
            color="white"
            textShadow="lg"
            my={2}
          >
            Video Library
          </Heading>

          <Collapse in={!isOpen} animateOpacity>
            <Button
              variant="transparent"
              type="button"
              onClick={onToggle}
              mt={{ base: 1, sm: 'inherit' }}
            >
              Show filters
            </Button>
          </Collapse>
        </Flex>
      </Box>

      <PrismicWrapper variant="light" small>
        <Content>
          <Text>
            The Video Library is a Community Project to collate all film of
            Quidditch in the UK. This library is driven by{' '}
            <a
              href="https://docs.google.com/spreadsheets/d/1SBfVt4GBCoyFGpjb-Y7dt4uDsbhZFPbkY-rBVNgZsgo/edit?fbclid=IwAR3Khtk0kQTbhWu1j10NtfdOj5NNDMw677g8zyf6Gu2fPCw9qn3Cv5yeJQ0#gid=0"
              target="_blank"
              rel="noopener noreferrer"
            >
              this Google Spreadsheet
            </a>{' '}
            put together by Rudi and any videos added there will appear here. As
            this library is maintained externally it is presented in
            &quot;As-is&quot; state and may contain errors or missing videos.
            Please help maintain this resource by submitting video to the
            spreadsheet{' '}
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSenOYNudVD9tNbYZFMWZAjqZbwwXM3gjNodtiwoJC_4PLghTA/viewform"
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </a>
            .
          </Text>
        </Content>
      </PrismicWrapper>

      <PrismicWrapper>
        {data?.map((row) => (
          <Fragment key={row.Date}>
            <Heading>{row.Date}</Heading>

            <Grid
              gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
              gridGap={{ base: 4, md: 9 }}
              px={{ base: 4, sm: 8, md: 0 }}
            >
              {row?.videos
                .filter((vid) => !isPericope(vid))
                .map((video, i) => (
                  <VideoCard video={video} key={`video-${row.Date}-${i}`} />
                ))}
            </Grid>
          </Fragment>
        ))}
      </PrismicWrapper>
    </>
  );
};

export const getStaticProps = async () => {
  const sheet = await getSheet(
    '1GPC0LlFuQCVieR0aNdQSl6LuWroU9cZ5sFE3oMlW2Zw',
    2
  );

  const data = sheet.reduce((arr, row) => {
    if (!row.Credit) {
      arr.push({ ...row, videos: [] });
    } else {
      arr[arr.length - 1].videos.push({
        ...row,
      });
    }
    return arr;
  }, []);

  return {
    props: { data },
    revalidate: 1,
  };
};

export default Page;
