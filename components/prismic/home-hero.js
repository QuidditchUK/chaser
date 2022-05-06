import { useRouter } from 'next/router';
import { useForm, Controller } from 'react-hook-form';

import { Flex, Box, Heading } from '@chakra-ui/react';
import { HERO_MIN_HEIGHTS } from 'styles/hero-heights';
import dynamic from 'next/dynamic';
import Input from 'components/formControls/input'; // DO NOT DYNAMIC IMPORT, BREAKS FORMS

const Button = dynamic(() => import('components/shared/button'));

const handleFindQuidditch = async ({ postcode }, router) => {
  await router.push(
    `/find-quidditch${postcode ? `?postcode=${postcode}` : ''}`
  );
  window.scrollTo(0, 0);
};

const Video = (props) => (
  <Box
    as="video"
    minHeight="100%"
    position="absolute"
    left={0}
    right={0}
    top={0}
    bottom={0}
    objectFit="cover"
    width="100%"
    {...props}
  />
);

const HomeHero = ({ primary }) => {
  const router = useRouter();
  const { control, handleSubmit } = useForm({
    defaultValues: { postcode: '' },
  });

  const { slug, cta_text, video_url, poster } = primary;

  return (
    <Box
      as="section"
      backgroundColor="qukBlue"
      minHeight={HERO_MIN_HEIGHTS}
      overflow="hidden"
      position="relative"
    >
      <Flex maxHeight={HERO_MIN_HEIGHTS} overflow="hidden">
        <Video
          src={video_url?.url}
          poster={poster?.url}
          preload="metadata"
          autoPlay
          loop
          muted
        />
      </Flex>
      <Flex
        position="absolute"
        minHeight={HERO_MIN_HEIGHTS}
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        top={0}
        width="100%"
      >
        <Heading
          as="label"
          htmlFor="hero_postcode"
          fontSize={{ base: '4xl', md: '7xl' }}
          mt={0}
          mb={8}
          color="white"
          textShadow="0 0 10px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.4)"
          id="home_hero_label" // FOR CAPE MODE
        >
          {slug}
        </Heading>

        <form
          onSubmit={handleSubmit((values) =>
            handleFindQuidditch(values, router)
          )}
        >
          <Flex flexDirection="row">
            <Controller
              control={control}
              name="postcode"
              render={({ field }) => (
                <Input {...field} id="postcode" placeholder="Postcode" />
              )}
            />
            <Button type="submit" variant="primary" ml={2}>
              {cta_text}
            </Button>
          </Flex>
        </form>
      </Flex>
    </Box>
  );
};

export default HomeHero;
