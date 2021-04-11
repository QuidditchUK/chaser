import { Fragment, useEffect, useState, useCallback } from 'react';
import { debounce } from 'throttle-debounce';
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
  Select,
} from '@chakra-ui/react';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';
import getSheet from 'modules/sheets';
import { BLOG_MIN_HEIGHTS } from 'styles/hero-heights';
import PrismicWrapper from 'components/prismic-wrapper';
import { useForm } from 'react-hook-form';
import Input from 'components/input'; // DO NOT DYNAMIC IMPORT, BREAKS FORMS

const Image = dynamic(() => import('components/image'));
const Meta = dynamic(() => import('components/meta'));
const Card = dynamic(() => import('components/card'));
const Content = dynamic(() => import('components/content'));
const Button = dynamic(() => import('components/button'));
const Embed = dynamic(() =>
  import('components/embed-slice').then(({ Embed }) => Embed)
);

const SHEET_ID = '1GPC0LlFuQCVieR0aNdQSl6LuWroU9cZ5sFE3oMlW2Zw';

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

const Page = ({ data: initialData }) => {
  const { isOpen, onToggle } = useDisclosure();
  const [data, setData] = useState(initialData);
  // const [loading, setLoading] = useState(false);

  const { handleSubmit, register, watch } = useForm({
    // mode: 'onBlur',
    defaultValues: {
      searchField: null,
      searchTerm: '',
    },
  });

  const watchSearchField = watch('searchField', null);
  const watchSearchTerm = watch('searchTerm', '');

  const debounceRefreshQuery = useCallback(
    debounce(1000, async ({ field, term }) => {
      if (!field || !term) {
        const sheet = await getSheet(SHEET_ID, 2);
        setData(DEFAULT_VIDEO_ORDER(sheet));
        return;
      }

      const filter = {
        ...(field === 'Team 1' && { 'Team 2': term }),
        [field]: term,
      };
      try {
        const data = await getSheet(SHEET_ID, 2, {
          filter,
          filterOptions: {
            operator: 'or',
            matching: 'loose',
          },
        });

        setData([{ videos: data }]);
      } catch (err) {
        console.log(err);
      }
    }),
    []
  );

  useEffect(() => {
    debounceRefreshQuery({ field: watchSearchField, term: watchSearchTerm });
  }, [debounceRefreshQuery, watchSearchField, watchSearchTerm]);

  return (
    <>
      <Meta
        subTitle="Video Library"
        image="https://images.prismic.io/chaser/15de9370-f5bd-4a7c-8b4d-9610e0b22e3b_video-uncropped.jpg?auto=compress,format"
        description="Browse the QuidditchUK Community Video Library for footage of Quidditch being played in the UK"
      />
      <form onSubmit={handleSubmit(() => {})}>
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

            <Collapse in={isOpen} animateOpacity>
              <Grid
                gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }}
                gridGap={2}
              >
                <Select
                  id="searchField"
                  name="searchField"
                  ref={register}
                  marginBottom={3}
                  bg="white"
                  borderColor="white"
                  color="qukBlue"
                  placeholder="Filter by"
                >
                  <option disabled value>
                    Select a field to filter by
                  </option>
                  <option value="Team 1">Team</option>
                  <option value="Tournament">Tournament</option>
                </Select>

                <Input
                  id="searchTerm"
                  name="searchTerm"
                  placeholder="e.g. Unbreakables"
                  ref={register}
                />
              </Grid>
            </Collapse>
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
          </Fragment>
        ))}
      </PrismicWrapper>
    </>
  );
};

export const getStaticProps = async () => {
  const sheet = await getSheet(SHEET_ID, 2);

  const data = DEFAULT_VIDEO_ORDER(sheet);

  return {
    props: { data },
    revalidate: 1,
  };
};

export default Page;
