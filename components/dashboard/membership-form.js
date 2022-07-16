import Router from 'next/router';
import NextLink from 'next/link';
import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Flex,
  Grid,
  Heading,
  UnorderedList,
  Link,
} from '@chakra-ui/react';
import Checkbox from 'components/formControls/checkbox';
import { object, boolean } from 'yup';

import { setCookies } from 'modules/cookies';

const Image = dynamic(() => import('components/shared/image'));
const Content = dynamic(() => import('components/shared/content'));
const Button = dynamic(() => import('components/shared/button'));

const Benefits = (props) => <Content fontSize="md" p={4} {...props} />;
const List = (props) => <UnorderedList p={0} pl={4} {...props} />;

const MembershipFormSchema = object({
  checkboxOne: boolean()
    .oneOf([true], 'You must agree to the Individual Membership Policy')
    .required(),
  checkboxTwo: boolean()
    .oneOf([true], 'You must agree to the  QuidditchUK Media Usage Policy')
    .required(),
  checkboxThree: boolean()
    .oneOf(
      [true],
      'You must agree to the QuidditchUK membership and gameplay policies'
    )
    .required(),
});

const membershipFormSubmit = () => {
  setCookies('MEMBERSHIP_AGREED', true);
  Router.push('/dashboard/membership/purchase');
};

const MembershipForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(MembershipFormSchema),
    mode: 'onBlur',
    defaultValues: {
      checkboxOne: false,
      checkboxTwo: false,
      checkboxThree: false,
    },
  });

  return (
    <Grid
      gridTemplateColumns={{ base: '1fr', lg: '2fr 1fr' }}
      gridGap={{ base: 4, md: 9 }}
      borderRadius="md"
      bg="white"
      overflow="hidden"
    >
      <Box py={4} px={{ base: 4, sm: 8, md: 9 }}>
        <Heading px={4} as="h2" mb={0} fontFamily="body" fontSize="3xl">
          Membership Benefits
        </Heading>
        <Benefits>
          <p>QuidditchUK Membership entitles a member to:</p>

          <List>
            <li>
              <strong>
                Eligibility to register for and compete at QuidditchUK official
                events and QuidditchUK affiliated events.
              </strong>
            </li>
            <li>
              Eligibility to qualify for and compete in the European Quidditch
              Cup.
            </li>
            <li>
              Included under QuidditchUK Public Liability insurance whenever
              training or competing with official QuidditchUK clubs or events.
            </li>
            <li>
              Access to coaching, refereeing, and snitching resources and
              training provided by QuidditchUK.
            </li>
            <li>
              Access to QuidditchUK grants and funding provided via your club.
            </li>
            <li>
              Eligibility to be scouted and selected for QuidditchUK recognised
              national training squads.
            </li>
            <li>
              Eligibility to be selected to compete at International Quidditch
              Association competitions.
            </li>
            <li>
              Coverage and regulation of transfers within European clubs
              overseen by Quidditch Europe.
            </li>
            <li>Transfer between QuidditchUK Clubs.</li>
            <li>
              Access to discounts and perks from QuidditchUK through our
              affiliated partners.
            </li>
            <li>Register under a single QuidditchUK Club.</li>
          </List>
        </Benefits>

        <Flex
          flexDirection="column"
          alignItems="center"
          py="5"
          borderTopWidth="1px"
          borderTopStyle="solid"
          borderTopColor="qukBlue"
        >
          <form onSubmit={handleSubmit(membershipFormSubmit)}>
            <Grid gridTemplateColumns="1fr" gridGap={3}>
              <Checkbox
                id="checkboxOne"
                isRequired={true}
                size="md"
                {...register('checkboxOne')}
                error={errors?.checkboxOne}
              >
                I acknowledge that I have read, understood, and agree to the{' '}
                <Link
                  color="monarchRed"
                  href="https://prismic-io.s3.amazonaws.com/chaser/7a339771-8248-4244-b141-cd2eb39a0028_QuidditchUK+Individual+Membership+Policy+2020_2021.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Individual Membership Policy
                </Link>
              </Checkbox>

              <Checkbox
                id="checkboxTwo"
                isRequired={true}
                size="md"
                {...register('checkboxTwo')}
                error={errors?.checkboxTwo}
              >
                I acknowledge that I have read, understood, and agree to the{' '}
                <Link
                  color="monarchRed"
                  href="https://prismic-io.s3.amazonaws.com/chaser/680b0ecd-ed85-487d-a727-3f5731f78bca_Media+Usage+Policy.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  QuidditchUK Media Usage Policy
                </Link>
              </Checkbox>

              <Checkbox
                id="checkboxThree"
                isRequired={true}
                size="md"
                {...register('checkboxThree')}
                error={errors?.checkboxThree}
              >
                I agree to abide by the{' '}
                <NextLink href="/about/documents-and-policies" passHref>
                  <Link color="monarchRed">
                    membership and gameplay policies
                  </Link>
                </NextLink>{' '}
                set out by QuidditchUK, and will uphold their values as a member
                of the quidditch community.
              </Checkbox>

              <Button type="submit" variant="primary">
                Purchase Membership
              </Button>
            </Grid>
          </form>
        </Flex>
      </Box>

      <Box position="relative" minHeight="300px" height="100%" width="100%">
        <Image
          layout="fill"
          alt="Two players laugh together at looking at the camera"
          src="https://images.prismic.io/chaser/e8e1b385-cd00-469d-aa67-f66dca0d5491_trev_member_editQUK.jpg?auto=compress,format"
          priority={true}
          borderRadius="0"
          clipPath={{
            base: 'none',
            lg: 'polygon(10% 0, 100% 0, 100% 100%, 0 100%)',
          }}
        />
      </Box>
    </Grid>
  );
};

export default MembershipForm;
