import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string, bool } from 'yup';
import { api } from 'modules/api';
import {
  Box,
  Grid,
  Flex,
  Heading,
  Select,
  Checkbox,
  Link,
} from '@chakra-ui/react';
import PrismicClubCard from 'components/prismic/club-card';

const Button = dynamic(() => import('components/shared/button'));
const Label = dynamic(() => import('components/formControls/label'));
const Required = dynamic(() => import('components/formControls/required'));

const InlineError = dynamic(() =>
  import('components/shared/errors').then(({ InlineError }) => InlineError)
);

const SelectClubSchema = object().shape({
  club_uuid: string().nullable().required('Required'),
  confirm: bool().oneOf(
    [true],
    'Please confirm that you have read the disclaimer'
  ),
});

const handleTransferSubmit = async (
  { club_uuid },
  callback,
  setServerError
) => {
  try {
    setServerError(null);

    await api.post('/transfers', { club_uuid });
    callback();
  } catch (err) {
    setServerError(err?.response?.data?.error?.message);
  }
};

const TransferRequestForm = ({ currentClub, clubs = [], callback }) => {
  const [selectedClub, setSelectedClub] = useState(null);
  const [serverError, setServerError] = useState(null);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(SelectClubSchema),
    defaultValues: {
      club_uuid: null,
      confirm: false,
    },
  });

  const currentSelectedClubUuid = watch('club_uuid', null);

  useEffect(() => {
    if (
      selectedClub?.uuid !== currentSelectedClubUuid &&
      currentSelectedClubUuid !== null
    ) {
      setSelectedClub(
        clubs.find(({ uuid }) => uuid === currentSelectedClubUuid)
      );
    }
  }, [selectedClub, setSelectedClub, currentSelectedClubUuid, clubs]);

  return (
    <>
      <Heading as="h3" color="qukBlue" fontFamily="body">
        Transfer Request
      </Heading>
      <Grid
        gridTemplateColumns={{ base: '1fr', md: '1fr 1fr' }}
        gridGap={{ base: 4, md: 9 }}
      >
        <Box bg="white" py={4} px={{ base: 4, sm: 8, md: 9 }} borderRadius="md">
          <p>
            Before confirming, please double check that you have selected the
            correct club and they know you are joining them this competitive
            season.
          </p>
          <p>
            Please note that once you have chosen your club and your transfer
            approved you will not be able to undo it, and any further changes
            will have to be requested and reviewed again.
          </p>
          <form
            onSubmit={handleSubmit((values) =>
              handleTransferSubmit(values, callback, setServerError)
            )}
          >
            <Grid gridTemplateColumns="1fr" mt={5}>
              <Label htmlFor="club_uuid" mb="2">
                Select your club <Required />
              </Label>

              <Controller
                control={control}
                name="club_uuid"
                render={({ field }) => (
                  <Select
                    {...field}
                    id="club_uuid"
                    as="select"
                    placeholder="Select a club"
                    bg="white"
                    color="qukBlue"
                    mb={3}
                  >
                    {clubs
                      .filter(({ uuid }) => uuid !== currentClub)
                      .map((club) => (
                        <option key={club.uuid} value={club.uuid}>
                          {club.name}
                        </option>
                      ))}
                  </Select>
                )}
              />

              {errors.club_uuid && (
                <InlineError mb={3}>{errors.club_uuid.message}</InlineError>
              )}
              <Label mt="3">
                <Controller
                  control={control}
                  name="confirm"
                  render={({ field }) => (
                    <Checkbox
                      {...field}
                      id="confirm"
                      spacing={3}
                      isChecked={field.value}
                    >
                      By checking this box I acknowledge that I have read the
                      above disclaimer and I intend to transfer to{' '}
                      <strong>{selectedClub?.name}</strong> to be my QuidditchUK
                      club.
                    </Checkbox>
                  )}
                />
              </Label>

              {errors.confirm && (
                <InlineError mb={3}>{errors.confirm.message}</InlineError>
              )}
            </Grid>

            <Button
              mt="2"
              type="submit"
              variant="green"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting' : 'Request Transfer'}
            </Button>
          </form>

          {serverError && <InlineError my={3}>{serverError}</InlineError>}
        </Box>
        {selectedClub && (
          <Flex flexDirection="column" key={selectedClub?.uuid}>
            <PrismicClubCard uid={selectedClub?.slug} />
          </Flex>
        )}
      </Grid>
    </>
  );
};

export default TransferRequestForm;
