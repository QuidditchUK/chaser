import React from 'react';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { Box, Flex, Grid, Heading, useToast, Text } from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { system_settings as PrismaSystemSetting } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { DateTime } from 'luxon';

import { isScoped_ServerProps } from 'modules/auth';
import { getBasePageProps } from 'modules/prismic';
import { EMT } from 'constants/scopes';
import settingsService from 'services/settings';
import useResponse from 'hooks/useResponse';
import Meta from 'components/shared/meta';
import Slice from 'components/shared/slice';
import InputV2 from 'components/formControls/inputV2';
import Button from 'components/shared/button';

function Settings({ settings }: { settings: PrismaSystemSetting }) {
  const toast = useToast();
  const {
    mutate: updateSettings,
    isLoading,
    error,
  } = useResponse({
    queryFn: settingsService.updateSettings,
    onSuccess: () => {
      toast({
        title: 'Student Summer Pass expiry date updated',
        description: 'The Student Summer Pass expiry date has been updated',
        status: 'success',
        duration: 9000,
        position: 'top',
        isClosable: true,
      });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ student_summer_pass_expiry: string }>({
    defaultValues: {
      student_summer_pass_expiry: settings.student_summer_pass_expiry
        ? DateTime.fromJSDate(
            new Date(settings.student_summer_pass_expiry)
          ).toFormat('yyyy-MM-dd')
        : DateTime.now().toFormat('yyyy-MM-dd'),
    },
  });

  return (
    <>
      <Meta subTitle="System Settings" title="Admin Dashboard" />
      <Slice>
        <Heading
          as="h3"
          fontFamily="body"
          color="qukBlue"
          display="flex"
          alignItems="center"
        >
          <Link href="/admin">Dashboard</Link> <ChevronRightIcon /> System
          Settings
        </Heading>

        <form
          onSubmit={handleSubmit((values) =>
            updateSettings({
              data: {
                student_summer_pass_expiry: DateTime.fromFormat(
                  values.student_summer_pass_expiry,
                  'yyyy-MM-dd',
                  { locale: 'en-GB' }
                ).toISO(),
              },
            })
          )}
        >
          <Grid
            bg="gray.100"
            p={4}
            borderRadius="lg"
            gridTemplateColumns={{ base: '1fr', md: '2fr 3fr' }}
            gridColumnGap={4}
          >
            <Flex flexDirection="column" gridGap={3}>
              <Flex flexDirection="row" gridGap={3} alignItems="flex-end">
                <InputV2
                  label="Student Summer Pass Expiry date"
                  isRequired
                  id="student_summer_pass_expiry"
                  min={DateTime.now().toFormat('yyyy-MM-dd')}
                  type="date"
                  error={errors?.student_summer_pass_expiry}
                  {...register('student_summer_pass_expiry')}
                />
                <Button type="submit" variant="green" isLoading={isLoading}>
                  Update
                </Button>
              </Flex>
            </Flex>
          </Grid>
        </form>
      </Slice>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const auth = await isScoped_ServerProps(context, [EMT]);

  if (!auth) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }

  const [{ data: settings }, basePageProps] = await Promise.all([
    settingsService.getSettings(),
    getBasePageProps(),
  ]);

  return {
    props: {
      settings,
      ...basePageProps,
    },
  };
};

Settings.auth = {
  skeleton: <Box />,
};

export default Settings;
