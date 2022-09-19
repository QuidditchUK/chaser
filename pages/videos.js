import { Fragment, useState } from 'react';
import dynamic from 'next/dynamic';
import { Heading, Flex, Text, Box, Grid } from '@chakra-ui/react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { getBasePageProps } from 'modules/prismic';
import getSheet from 'modules/sheets';
import { BLOG_MIN_HEIGHTS } from 'styles/hero-heights';
import InputV2 from 'components/formControls/inputV2';

const Slice = dynamic(() => import('components/shared/slice'));
const Meta = dynamic(() => import('components/shared/meta'));
const Content = dynamic(() => import('components/shared/content'));
const Button = dynamic(() => import('components/shared/button'));
const VideoCard = dynamic(() => import('components/shared/video-card'));

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
            alt="Commentary and video crew huddle around cameras and microphones during a match"
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
                <InputV2
                  {...register('searchTerm')}
                  hideLabel
                  label="Search by Team or Tournament"
                  width="initial"
                  id="searchTerm"
                  placeholder="Search by Team or Tournament"
                />
              </Flex>

              <Button variant="secondary" type="submit">
                Search Videos
              </Button>
            </Grid>
          </Flex>
        </Box>
      </form>

      <Slice variant="light" size="sm">
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
      </Slice>

      <Slice>
        {data?.map((row, i) => (
          <Fragment key={row?.Date || `video-row-${i}`}>
            <Heading>{row?.Date}</Heading>

            <Grid
              gridTemplateColumns="1fr"
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
      </Slice>
    </>
  );
};

export const getStaticProps = async () => {
  const basePageProps = await getBasePageProps();
  const sheet = await getSheet(SHEET_ID, 'Footage');

  const data = DEFAULT_VIDEO_ORDER(sheet);

  return {
    props: { data, ...basePageProps },
    revalidate: 1,
  };
};

export default Page;
