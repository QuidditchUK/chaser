import get from 'just-safe-get';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';
import { Box, Flex, Heading } from '@chakra-ui/react';
import { HERO_MIN_HEIGHTS } from 'styles/hero-heights';

const Image = dynamic(() => import('components/image'));
const Button = dynamic(() => import('components/button'));
const Input = dynamic(() => import('components/input'));

const handleFindQuidditch = async ({ postcode }, router) => {
  await router.push(
    `/find-quidditch${postcode ? `?postcode=${postcode}` : ''}`
  );
  window.scrollTo(0, 0);
};

const FindQuidditch = (rawData) => {
  const router = useRouter();
  const title = get(rawData, 'primary.title');
  const image = get(rawData, 'primary.image');
  const variant = get(rawData, 'primary.variant');

  const { register, handleSubmit } = useForm({
    defaultValues: { postcode: '' },
  });

  return (
    <Box
      as="section"
      position="relative"
      backgroundColor="qukBlue"
      minHeight={HERO_MIN_HEIGHTS}
      px={{ base: 4, sm: 8, md: 9 }}
    >
      <Image
        src={image.url}
        alt={image.alt}
        layout="fill"
        objectPosition="center center"
        objectFit="cover"
        borderRadius="0"
      />
      <Flex
        position="relative"
        minHeight={HERO_MIN_HEIGHTS}
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Heading
          as="label"
          htmlFor="prismic_postcode"
          fontSize={{ base: '3xl', md: '4xl' }}
          color="white"
          textAlign="center"
          mt={0}
          textShadow="lg"
          pb="7"
          id="find_quidditch_label"
        >
          {title}
        </Heading>
        <form
          onSubmit={handleSubmit((values) =>
            handleFindQuidditch(values, router)
          )}
        >
          <Flex flexDirection="row">
            <Input
              ref={register}
              placeholder="Enter your postcode"
              name="postcode"
            />
            <Button type="submit" variant={variant} ml={2}>
              Find Quidditch
            </Button>
          </Flex>
        </form>
      </Flex>
    </Box>
  );
};

export default FindQuidditch;
