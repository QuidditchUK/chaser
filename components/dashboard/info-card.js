import Link from 'next/link';
import {
  Box,
  Flex,
  Heading,
  Text,
  useStyleConfig,
  Link as ChakraLink,
} from '@chakra-ui/react';
import Image from 'next/image';
import { PlainWrapper } from 'components/shared/card';
import Button from 'components/shared/button';

const PositionImage = {
  'Keeper/Chaser': '/images/chaser.jpg',
  Beater: '/images/beater.jpg',
  Seeker: '/images/seeker.jpg',
};

export const InfoCard = ({ user, ...props }) => {
  const styles = useStyleConfig('Card', { variant: 'white' });

  return (
    <PlainWrapper flexDirection="column" height="100%" {...props}>
      <Box
        __css={styles}
        as="article"
        bg="qukBlue"
        height="100%"
        width="100%"
        overflow="hidden"
        position="relative"
        borderRadius="xl"
        {...props}
      >
        <Image
          src={PositionImage[user.position] || '/images/default-profile.jpg'}
          role="presentation"
          alt=""
          layout="fill"
          objectFit="cover"
        />
        <Box
          position="absolute"
          bottom="0"
          width="100%"
          height="100%"
          opacity={0.8}
          bg="qukBlue"
          color="white"
        />
        <Flex
          position="absolute"
          bottom="0"
          width="100%"
          height="100%"
          bgGradient={`linear(to-tl, southernBlue, rgba(0, 0, 0, 0))`}
          color="white"
          px={{ base: 4, sm: 8, md: 9 }}
          py={4}
          flexDirection="column"
          justifyContent="center"
          textAlign="center"
        >
          <Heading
            as="h2"
            fontSize="2xl"
            fontFamily="body"
            textShadow="0 0 4px rgb(0,0,0)"
            mb={0}
          >
            {user?.first_name} {user?.last_name}
          </Heading>

          <Text
            fontSize="sm"
            fontWeight="bold"
            textShadow="0 0 2px rgb(0,0,0)"
            my={2}
          >
            {user?.position}
          </Text>

          <Link href="/dashboard/account/national-team" passHref>
            <ChakraLink>
              <Button variant="transparent" mt={2}>
                Update your player profile
              </Button>
            </ChakraLink>
          </Link>
        </Flex>
      </Box>
    </PlainWrapper>
  );
};

export default InfoCard;
