import { object, string } from 'yup';
import dynamic from 'next/dynamic';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Grid, Flex, Heading, Text, Box } from '@chakra-ui/react';

import { buttonVariants, labelVariants } from 'components/shared/slice';
import Image from 'components/shared/image';
import InputV2 from 'components/formControls/inputV2';
import TextareaV2 from 'components/formControls/textareaV2';

import useTempPopup from 'hooks/useTempPopup';
import Success from 'components/formControls/success';
import Error from 'components/shared/errors';
import Select from 'components/formControls/select';
import clubsService from 'services/clubs';

const Slice = dynamic(() => import('components/shared/slice'));
const Button = dynamic(() => import('components/shared/button'));

const RegisterClubFormSchema = object().shape({
  name: string().required('Please enter your name'),
  email: string()
    .email('Invalid email address')
    .required('Please enter a valid email address'),
  clubName: string().required('Please enter the name of your club'),
  location: string().required('Please enter the area you will be playing'),
  league: string()
    .nullable()
    .required('Please select the league you intend to play in'),
  message: string().nullable(),
});

const handleRegisterClubSubmit = async (
  values,
  resetForm,
  setServerError,
  setServerSuccess
) => {
  try {
    setServerError(null);
    setServerSuccess(null);

    await clubsService.registerClub({ data: values });

    setServerSuccess(true);
    resetForm({});
  } catch (err) {
    setServerError(err?.response?.data?.error?.message);
  }
};

const VARITANT_BG = {
  secondary: 'monarchRed',
  light: 'greyLight',
  dark: 'darkBlue',
  white: 'white',
  primary: 'qukBlue',
};

const LEAGUES = ['Community', 'University'];

const RegisterClubForm = ({ primary }) => {
  const [serverError, setServerError] = useTempPopup();
  const [serverSuccess, setServerSuccess] = useTempPopup();

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(RegisterClubFormSchema),
    defaultValues: {
      name: '',
      email: '',
      clubName: '',
      location: '',
      league: '',
      message: '',
    },
  });

  const clipPath = 'polygon(10% 0, 100% 0, 100% 100%, 0 100%)';
  const { variant, image } = primary;

  return (
    <Slice variant={variant} size="full" px="0" py="0">
      <Grid
        gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }}
        gridGap={4}
        h="100%"
      >
        <Flex
          py={5}
          pr={4}
          lineHeight="24px"
          bg={VARITANT_BG[variant]}
          direction="column"
          justifySelf="flex-end"
          maxWidth="640px"
          pl={{ base: 8, '2xl': 0 }}
        >
          <Heading as="h1" fontFamily="body" mb={0}>
            Register a Club
          </Heading>
          <Text>
            Starting a new club in your area? Get in touch so we can help you on
            your journey, from the first training session to playing in your
            first QuidditchUK Tournament.
          </Text>
          <form
            onSubmit={handleSubmit((values) =>
              handleRegisterClubSubmit(
                values,
                reset,
                setServerError,
                setServerSuccess
              )
            )}
          >
            <Grid
              gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }}
              gridGap={4}
            >
              <InputV2
                label="Your name"
                isRequired
                id="name"
                placeholder="Your name"
                error={errors?.name}
                {...register('name')}
                color={labelVariants[variant]}
              />

              <InputV2
                label="Club email"
                isRequired
                id="email"
                placeholder="Club email address"
                error={errors?.email}
                {...register('email')}
                color={labelVariants[variant]}
              />

              <InputV2
                label="Name of your club"
                isRequired
                id="clubName"
                placeholder="Name of your club"
                error={errors?.clubName}
                {...register('clubName')}
                color={labelVariants[variant]}
              />

              <InputV2
                label="Location of the club"
                isRequired
                id="location"
                placeholder="Where you intend to be based"
                error={errors?.location}
                {...register('location')}
                color={labelVariants[variant]}
              />

              <Flex gridColumn="1 / -1" flexDirection="column">
                <Select
                  label="Which league you intend to compete in"
                  isRequired
                  id="league"
                  placeholder="Select your league"
                  options={LEAGUES.map((league) => ({
                    value: league,
                    label: league,
                  }))}
                  error={errors?.league}
                  color={labelVariants[variant]}
                  {...register('league')}
                />
              </Flex>

              <Flex gridColumn="1 / -1" flexDirection="column">
                <TextareaV2
                  label="Any extra information"
                  id="message"
                  placeholder="Any extra information e.g. social media links, training details that you might have decided already"
                  color={labelVariants[variant]}
                  {...register('message')}
                />
              </Flex>
              <Button
                type="submit"
                variant={buttonVariants[variant]}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting' : 'Register a Club'}
              </Button>
            </Grid>
          </form>

          {serverError && <Error>{serverError}</Error>}
          {serverSuccess && <Success>Club registration sent</Success>}
        </Flex>

        <Box
          position="relative"
          bg="grey.100"
          minHeight={image?.url ? '300px' : 'initial'}
          display={image?.url ? 'block' : 'none'}
          height="100%"
          width="100%"
          overflow="hidden"
        >
          {image?.url && (
            <Image
              layout="fill"
              height="100%"
              width={image?.width}
              alt={image?.alt}
              src={image?.url}
              borderRadius={0}
              clipPath={{ base: 'none', md: clipPath }}
              objectFit="cover"
            />
          )}
        </Box>
      </Grid>
    </Slice>
  );
};

export default RegisterClubForm;
