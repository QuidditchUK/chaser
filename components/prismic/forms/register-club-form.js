import { useState, useEffect } from 'react';
import { object, string } from 'yup';
import dynamic from 'next/dynamic';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Grid, Flex, Heading, Text, Box, Select } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import { buttonVariants } from 'components/shared/slice';
import Input from 'components/formControls/input'; // DO NOT DYNAMIC IMPORT, BREAKS FORMS
import Textarea from 'components/formControls/textarea'; // DO NOT DYNAMIC IMPORT, BREAKS FORMS
import Image from 'components/shared/image';

import { api } from 'modules/api';

const Slice = dynamic(() => import('components/shared/slice'));
const Label = dynamic(() => import('components/formControls/label'));
const Button = dynamic(() => import('components/shared/button'));
const Required = dynamic(() => import('components/formControls/required'));
const InlineError = dynamic(() =>
  import('components/shared/errors').then(({ InlineError }) => InlineError)
);

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

    await api.post('/clubs/register', values);

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
  const [serverError, setServerError] = useState(null);
  const [serverSuccess, setServerSuccess] = useState(null);

  const {
    control,
    handleSubmit,
    reset,
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

  useEffect(() => {
    if (serverSuccess) {
      const timer = setTimeout(() => {
        setServerSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }

    return () => {};
  }, [serverSuccess]);

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
              <Flex direction="column">
                <Label htmlFor="name">
                  Your name <Required />
                </Label>

                <Controller
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="name"
                      placeholder="Your name"
                      my={3}
                      error={errors.name}
                    />
                  )}
                />

                {errors.name && (
                  <InlineError marginBottom={3}>
                    {errors.name.message}
                  </InlineError>
                )}
              </Flex>

              <Flex direction="column">
                <Label htmlFor="email">
                  Club email <Required />
                </Label>

                <Controller
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="email"
                      placeholder="Club email address"
                      my={3}
                      error={errors.email}
                    />
                  )}
                />

                {errors.email && (
                  <InlineError marginBottom={3}>
                    {errors.email.message}
                  </InlineError>
                )}
              </Flex>

              <Flex direction="column">
                <Label htmlFor="clubName">
                  Name of the club <Required />
                </Label>

                <Controller
                  control={control}
                  name="clubName"
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="clubName"
                      placeholder="Name of your club"
                      my={3}
                      error={errors.clubName}
                    />
                  )}
                />

                {errors.clubName && (
                  <InlineError marginBottom={3}>
                    {errors.clubName.message}
                  </InlineError>
                )}
              </Flex>

              <Flex direction="column">
                <Label htmlFor="location">
                  Location of the club <Required />
                </Label>

                <Controller
                  control={control}
                  name="location"
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="location"
                      placeholder="Where you intend to be based"
                      my={3}
                      error={errors.location}
                    />
                  )}
                />

                {errors.location && (
                  <InlineError marginBottom={3}>
                    {errors.location.message}
                  </InlineError>
                )}
              </Flex>

              <Flex gridColumn="1 / -1" flexDirection="column">
                <Label htmlFor="league">
                  Which league you intend to compete in <Required />
                </Label>

                <Controller
                  control={control}
                  name="league"
                  render={({ field }) => (
                    <Select
                      {...field}
                      id="league"
                      my={3}
                      placeholder="Select your league"
                      bg="white"
                      color="qukBlue"
                    >
                      {LEAGUES.map((league) => (
                        <option key={league} value={league}>
                          {league}
                        </option>
                      ))}
                    </Select>
                  )}
                />
              </Flex>

              <Flex gridColumn="1 / -1" flexDirection="column">
                <Label htmlFor="message">Any extra information</Label>

                <Controller
                  control={control}
                  name="message"
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      id="message"
                      placeholder="Any extra information e.g. social media links, training details that you might have decided already"
                      my={3}
                      error={errors.message}
                    />
                  )}
                />
              </Flex>
            </Grid>

            <Button
              type="submit"
              variant={buttonVariants[variant]}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting' : 'Register a Club'}
            </Button>
          </form>

          {serverError && (
            <>
              <InlineError my={3}>{serverError}</InlineError>
            </>
          )}

          {serverSuccess && (
            <Flex
              alignItems="center"
              bg="keeperGreen"
              px={4}
              py={1}
              mt={6}
              borderColor="keeperGreen"
              borderWidth="1px"
              borderStyle="solid"
              color="white"
              borderRadius="md"
            >
              <CheckIcon mr={3} />{' '}
              <Text fontWeight="bold">Club registration sent</Text>
            </Flex>
          )}
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
