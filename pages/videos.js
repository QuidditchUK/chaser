import { Fragment, useEffect, useState } from 'react';
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
  Stack,
} from '@chakra-ui/react';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';
import getSheet from 'modules/sheets';
import { BLOG_MIN_HEIGHTS } from 'styles/hero-heights';
import PrismicWrapper from 'components/prismic-wrapper';
import { useForm } from 'react-hook-form';
import Input from 'components/input'; // DO NOT DYNAMIC IMPORT, BREAKS FORMS

const Meta = dynamic(() => import('components/meta'));
const Card = dynamic(() => import('components/card'));
const Content = dynamic(() => import('components/content'));
const Button = dynamic(() => import('components/button'));
const Embed = dynamic(() =>
  import('components/embed-slice').then(({ Embed }) => Embed)
);

const SHEET_ID = '1SBfVt4GBCoyFGpjb-Y7dt4uDsbhZFPbkY-rBVNgZsgo';

const DEFAULT_VIDEO_ORDER = (sheet) =>
  sheet.reduce((arr, row) => {
    if (!row.Credit) {
      arr.push({ ...row, videos: [] });
    } else {
      arr[arr.length - 1].videos.push({
        ...row,
      });
    }
    return arr;
  }, []);

const persicopeRegex = new RegExp('periscope', 'gi');

const isPericope = (video) => {
  return persicopeRegex.test(video.Link);
};

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
        image={oembed?.data && !loading ? <Embed embed={oembed?.data} /> : null}
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
            {videos.length !== 1 && (
              <Stack direction="row" spacing={2} pt={2}>
                {videos.map((videoLink, i) => (
                  <Button
                    onClick={() => {
                      setLoading(true);
                      setVideoLink(videoLink);
                    }}
                    key={`video-link-${videoLink}`}
                  >
                    Link {i + 1}
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

const handleSearchSubmit = async ({ values, setData }) => {
  if (!values.searchTerm) {
    const sheet = await getSheet(SHEET_ID, 'Footage');
    setData(DEFAULT_VIDEO_ORDER(sheet));
    return;
  }

  try {
    const data = await getSheet(SHEET_ID, 'Footage', {
      filter: {
        'Team 1': values.searchTerm,
        'Team 2': values.searchTerm,
        Tournament: values.searchTerm,
      },
      filterOptions: {
        operator: 'or',
        matching: 'loose',
      },
    });

    setData([{ videos: data }]);
  } catch (err) {
    console.log(err);
  }
};

const Page = ({ data: initialData }) => {
  const [data, setData] = useState(initialData);

  const { handleSubmit, register } = useForm({
    defaultValues: {
      searchTerm: '',
    },
  });

  return (
    <>
      <Meta
        subTitle="Video Library"
        image="https://images.prismic.io/chaser/43a62356-5609-45c4-a9dc-737db619449d_Volunteers%21.jpg?auto=compress,format"
        description="Browse the QuidditchUK Community Video Library for footage of Quidditch being played in the UK"
      />
      <form
        onSubmit={handleSubmit((values) =>
          handleSearchSubmit({ values, setData })
        )}
      >
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
            priority={true}
          />

          <Flex
            position="relative"
            minHeight={BLOG_MIN_HEIGHTS}
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Heading
              fontSize={{ base: '4xl', md: '7xl' }}
              color="white"
              textShadow="lg"
              my={2}
            >
              Video Library
            </Heading>

            <Grid
              gridTemplateColumns={{ base: '1fr', md: '2fr 1fr' }}
              gridGap={2}
            >
              <Flex flexDirection="column">
                <Input
                  id="searchTerm"
                  name="searchTerm"
                  placeholder="Search by Team or Tournament"
                  ref={register}
                />
              </Flex>

              <Button variant="secondary" type="submit">
                Search Videos
              </Button>
            </Grid>
          </Flex>
        </Box>
      </form>

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
        {data?.map((row, i) => (
          <Fragment key={row?.Date || `video-row-${i}`}>
            <Heading>{row?.Date}</Heading>

            <Grid
              gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
              gridGap={{ base: 4, md: 9 }}
              px={{ base: 4, sm: 8, md: 0 }}
            >
              {row?.videos
                .filter((vid) => !isPericope(vid))
                .map((video, i) => (
                  <VideoCard video={video} key={`video-${video.Link}-${i}`} />
                ))}
            </Grid>

            {row?.videos?.length === 0 && (
              <>
                <Heading
                  as="h2"
                  fontSize="3xl"
                  mb={0}
                  fontFamily="body"
                  textAlign="center"
                  color="primary"
                >
                  No videos matched your search
                </Heading>
                <Content>
                  <Text textAlign="center">
                    Adjust your search filters and double-check your terms, or
                    you can always check the raw spreadsheet{' '}
                    <a
                      href="https://docs.google.com/spreadsheets/d/1SBfVt4GBCoyFGpjb-Y7dt4uDsbhZFPbkY-rBVNgZsgo/edit?usp=sharing"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      here
                    </a>
                  </Text>
                </Content>
              </>
            )}
          </Fragment>
        ))}
      </PrismicWrapper>
    </>
  );
};

export const getStaticProps = async () => {
  const sheet = await getSheet(SHEET_ID, 'Footage');

  const data = DEFAULT_VIDEO_ORDER(sheet);

  return {
    props: { data },
    revalidate: 1,
  };
};

export default Page;
