import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

import { Flex, Box, Heading } from '@chakra-ui/react';
import { HERO_MIN_HEIGHTS } from 'styles/hero-heights';
import dynamic from 'next/dynamic';
import InputV2 from 'components/formControls/inputV2';

const Button = dynamic(() => import('components/shared/button'));

const handleFindQuidditch = async ({ postcode }, router) => {
  await router.push(`/clubs${postcode ? `?postcode=${postcode}` : ''}`);
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
  const { register, handleSubmit } = useForm({
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
        >
          <track default kind="captions" srcLang="en" src="/muted.vtt"></track>
        </Video>
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
        >
          {slug}
        </Heading>

        <form
          onSubmit={handleSubmit((values) =>
            handleFindQuidditch(values, router)
          )}
        >
          <Flex flexDirection="row">
            <InputV2
              id="postcode"
              {...register('postcode')}
              hideLabel
              label="Postcode"
              placeholder="Postcode"
              width="initial"
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
