import { useRouter } from 'next/router';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useForm, Controller } from 'react-hook-form';
import { Box, Flex, Heading } from '@chakra-ui/react';
import { HERO_MIN_HEIGHTS } from 'styles/hero-heights';
import Input from 'components/formControls/input'; // DO NOT DYNAMIC IMPORT, BREAKS FORMS

const Button = dynamic(() => import('components/shared/button'));

const handleFindQuidditch = async ({ postcode }, router) => {
  await router.push(
    `/find-quidditch${postcode ? `?postcode=${postcode}` : ''}`
  );
  window.scrollTo(0, 0);
};

const FindQuidditch = ({ primary }) => {
  const router = useRouter();
  const { title, image, variant } = primary;

  const { control, handleSubmit } = useForm({
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
            <Controller
              control={control}
              name="postcode"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter your postcode"
                  id="postcode"
                />
              )}
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
