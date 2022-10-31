import { useRouter } from 'next/router';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';
import { Box, Flex, Heading } from '@chakra-ui/react';
import { HERO_MIN_HEIGHTS } from 'styles/hero-heights';
import InputV2 from 'components/formControls/inputV2';

const Button = dynamic(() => import('components/shared/button'));

const handleFindQuidditch = async ({ postcode }, router) => {
  await router.push(`/clubs${postcode ? `?postcode=${postcode}` : ''}`);
  window.scrollTo(0, 0);
};

const FindQuidditch = ({ slice }) => {
  const router = useRouter();
  const { title, image, variant } = slice?.primary;

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
          textShadow="0 0 10px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.4)"
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
            <InputV2
              id="postcode"
              {...register('postcode')}
              hideLabel
              label="Postcode"
              placeholder="Enter your postcode"
              width="initial"
            />
            <Button type="submit" variant={variant} ml={2}>
              Find Quadball
            </Button>
          </Flex>
        </form>
      </Flex>
    </Box>
  );
};

export default FindQuidditch;
