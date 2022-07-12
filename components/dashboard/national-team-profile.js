import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import dynamic from 'next/dynamic';

import { object, string, number } from 'yup';
import { Grid, Heading, Link } from '@chakra-ui/react';

const Button = dynamic(() => import('components/shared/button'));

import Switch from 'components/formControls/switch';
import Select from 'components/formControls/select';
import InputV2 from 'components/formControls/inputV2';
import useTempPopup from 'hooks/useTempPopup';
import Success from 'components/formControls/success';
import Error from 'components/shared/errors';
import TextareaV2 from 'components/formControls/textareaV2';
import usersService from 'services/users';

const NATIONAL_TEAMS = ['England', 'Scotland', 'Wales'];
const POSITIONS = ['Keeper/Chaser', 'Beater', 'Seeker'];

const NationalTeamFormSchema = object().shape({
  first_team: string().when('national_team_interest', {
    is: true,
    then: string()
      .nullable()
      .required('Please select your first choice National Team.'),
    otherwise: string().nullable(),
  }),
  second_team: string().nullable(),
  third_team: string().nullable(),
  position: string().when('national_team_interest', {
    is: true,
    then: string().nullable().required('Please select your primary position.'),
    otherwise: string().nullable(),
  }),
  playstyle: string().when('national_team_interest', {
    is: true,
    then: string()
      .nullable()
      .required('Please enter a short description of your playstyle.'),
    otherwise: string().nullable(),
  }),
  years: number().when('national_team_interest', {
    is: true,
    then: number()
      .transform((currentValue, originalValue) => {
        return originalValue === '' ? null : currentValue;
      })
      .nullable()
      .required(
        'Please estimate how many years of active quidditch experience you have.'
      ),
    otherwise: number()
      .transform((currentValue, originalValue) => {
        return originalValue === '' ? null : currentValue;
      })
      .nullable(),
  }),
  experience: string().when('national_team_interest', {
    is: true,
    then: string()
      .nullable()
      .required('Please summarise your quidditch experience.'),
    otherwise: string().nullable(),
  }),
});

const handleFormSubmit = async (values, setServerError, setServerSuccess) => {
  try {
    setServerError(null);
    setServerSuccess(null);

    await usersService.updateUserNationalProfile({ data: values });
    setServerSuccess(true);
  } catch (err) {
    setServerError(err?.response?.data?.error?.message);
  }
};

const NationalTeamProfileForm = ({ profile = {} }) => {
  const [serverError, setServerError] = useTempPopup();
  const [serverSuccess, setServerSuccess] = useTempPopup();

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(NationalTeamFormSchema),
    defaultValues: {
      national_team_interest: profile.national_team_interest,
      first_team: profile.first_team,
      second_team: profile.second_team,
      third_team: profile.third_team,
      position: profile.position,
      playstyle: profile.playstyle,
      years: profile.years,
      experience: profile.experience,
    },
  });

  const watchInterest = watch('national_team_interest');

  return (
    <>
      <Heading as="h1" fontFamily="body" textAlign="center">
        National Team Profile
      </Heading>
      <p>
        Welcome to <strong>your</strong> National Team Profile. Use the form
        below to get on the radar of the best Managers and Coaches in the UK,
        and register your interest in playing for one of the QuidditchUK
        National Teams.
        <br />
        <em>
          You can check out our National Team policies{' '}
          <Link href="/about/documents-and-policies">here</Link>.
        </em>
      </p>

      <form
        onSubmit={handleSubmit((values) =>
          handleFormSubmit(values, setServerError, setServerSuccess)
        )}
      >
        <Grid gridTemplateColumns="1fr" gridGap={3}>
          <Switch
            label="Are you interested?"
            isRequired={true}
            id="national_team_interest"
            size="lg"
            colorScheme="green"
            display="flex"
            alignItems="center"
            {...register('national_team_interest')}
          />

          {watchInterest && (
            <>
              <Select
                label={
                  <>
                    List the national teams that you are elligible for, and want
                    to be considered for, in order of preference.
                    <br />
                    <em>
                      {/* National Eligibility Criteria URL should point to the pdf file in the CMS when possible. */}
                      You can check eligibility criteria{' '}
                      <Link href="https://quidditchuk.org/about/documents-and-policies">
                        here
                      </Link>
                      .
                    </em>
                  </>
                }
                id="first_team"
                isRequired
                placeholder="First choice national team"
                options={NATIONAL_TEAMS.map((team) => ({
                  value: team,
                  label: team,
                }))}
                error={errors?.first_team}
                {...register('first_team')}
              />

              <Select
                label="Second Team"
                hideLabel
                id="second_team"
                placeholder="Second choice national team"
                options={NATIONAL_TEAMS.map((team) => ({
                  value: team,
                  label: team,
                }))}
                error={errors?.second_team}
                {...register('second_team')}
              />

              <Select
                label="Third Team"
                hideLabel
                id="third_team"
                placeholder="Third choice national team"
                options={NATIONAL_TEAMS.map((team) => ({
                  value: team,
                  label: team,
                }))}
                error={errors?.third_team}
                {...register('third_team')}
              />

              <Select
                label="What is your primary position?"
                id="position"
                isRequired
                placeholder="Select your primary position"
                options={POSITIONS.map((position) => ({
                  value: position,
                  label: position,
                }))}
                error={errors?.position}
                {...register('position')}
              />

              <TextareaV2
                label={
                  <>
                    Provide a brief description of your playstyle.
                    <br />
                    <em>
                      We are not looking for anything specific here, just tell
                      us about you and what makes you stand out on pitch.
                    </em>
                  </>
                }
                isRequired
                id="playstyle"
                placeholder="Your playstyle"
                error={errors?.playstyle}
                {...register('playstyle')}
              />

              <InputV2
                label="How many years have you been actively playing quidditch?"
                placeholder="Years active"
                type="number"
                error={errors?.years}
                isRequired
                id="years"
                {...register('years')}
              />

              <TextareaV2
                label={
                  <>
                    Summarise your quidditch experience.
                    <br />
                    <em>
                      Focus on high-level tournaments and matches that you have
                      been a part of, and your current best finishes.
                    </em>
                  </>
                }
                isRequired
                id="experience"
                placeholder="Playing experience"
                error={errors?.experience}
                {...register('experience')}
              />
            </>
          )}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting' : 'Update'}
          </Button>
        </Grid>
      </form>

      {serverError && <Error>{serverError}</Error>}
      {serverSuccess && <Success>Profile updated</Success>}
    </>
  );
};

export default NationalTeamProfileForm;
