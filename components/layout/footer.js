import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';

import * as prismicH from '@prismicio/helpers';
import {
  Box,
  Grid,
  Flex,
  Link as ChakraLink,
  Text,
  Heading,
  UnorderedList,
  ListItem,
} from '@chakra-ui/react';
import InputV2 from 'components/formControls/inputV2';
import { linkResolver } from '../../modules/prismic';

const Logo = dynamic(() => import('components/shared/logo'));
const Container = dynamic(() => import('components/layout/container'));
const Button = dynamic(() => import('components/shared/button'));
const FacebookIcon = dynamic(() => import('public/images/facebook.svg'));
const TwitterIcon = dynamic(() => import('public/images/twitter.svg'));
const InstagramIcon = dynamic(() => import('public/images/instagram.svg'));
const YoutubeIcon = dynamic(() => import('public/images/youtube.svg'));
const VercelLogo = dynamic(() => import('public/images/powered-by-vercel.svg'));

const year = new Date().getFullYear();

const IconWrapper = (props) => (
  <ChakraLink height="30px" width="30px" ml={6} {...props} />
);

const Icon = (props) => (
  <Box color="greyLight" _hover={{ color: 'monarchRed' }} {...props} />
);

const Item = (props) => <ListItem lineHeight="32px" {...props} />;

const ActiveLink = ({ href, children }) => {
  const { asPath } = useRouter();
  const regexAs = RegExp(href.replace(/\//g, '\\/'), 'g');

  const isActive = regexAs.test(asPath);

  return (
    <Link href={href} passHref>
      <ChakraLink
        textDecoration="none"
        color="white"
        fontWeight={isActive ? 'bold' : 'normal'}
        _hover={{ borderBottom: '2px solid', borderColor: 'white' }}
      >
        {children}
      </ChakraLink>
    </Link>
  );
};

const FooterMenu = ({ label, items }) => (
  <Box>
    <Heading as="h3" fontSize="lg">
      {label}
    </Heading>

    <UnorderedList pl={0} ml={0} styleType="none">
      {items?.map(({ link_label, link }) => (
        <Item key={`${link?.url}-${link_label}`}>
          <ActiveLink href={prismicH.asLink(link, linkResolver)}>
            {link_label}
          </ActiveLink>
        </Item>
      ))}
    </UnorderedList>
  </Box>
);

const handleFindQuidditch = async ({ postcode }, router) => {
  await router.push(`/clubs${postcode ? `?postcode=${postcode}` : ''}`);
  window.scrollTo(0, 0);
};

export const Footer = ({ data }) => {
  const router = useRouter();
  const { register, handleSubmit } = useForm({
    defaultValues: { postcode: '' },
  });

  return (
    <Box as="footer" flexShrink="0">
      <Box
        bg="qukBlue"
        color="white"
        py={{ base: 2, lg: 5 }}
        px={{ base: 4, sm: 8, md: 9 }}
      >
        <Container pb={3}>
          <Grid
            gridTemplateColumns={{ base: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }}
            gridGap={{ base: 4, md: 9 }}
          >
            <FooterMenu label={data?.menu_1_label} items={data?.menu_1_links} />
            <FooterMenu label={data?.menu_2_label} items={data?.menu_2_links} />
            <FooterMenu label={data?.menu_3_label} items={data?.menu_3_links} />

            <Box>
              <Heading as="h3" fontSize="lg">
                {data?.disclaimer_label}
              </Heading>

              <Text fontSize="sm">{data?.disclaimer}</Text>

              <ChakraLink
                color="qukBlue"
                aria-label="Vercel"
                href="https://vercel.com/?utm_source=quidditchuk&utm_campaign=oss"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Box as={VercelLogo} w={{ base: '100%', md: '60%' }} />
              </ChakraLink>
            </Box>
          </Grid>
        </Container>

        <Container
          borderTop="3px solid white"
          py={5}
          textAlign={{ base: 'center', md: 'left' }}
        >
          <Grid
            gridTemplateColumns={{ base: '1fr', md: '4fr 2fr' }}
            gridGap={{ base: 4, md: 9 }}
          >
            <Flex
              flexDirection="column"
              order={{ base: 2, md: 1 }}
              alignItems={{ base: 'center', md: 'flex-start' }}
            >
              <Link href="/" passHref>
                <ChakraLink height={{ base: '35px', xl: '45px' }}>
                  <Logo filter />
                </ChakraLink>
              </Link>

              <Text fontSize="sm">
                All Rights Reserved &copy; {year} QuidditchUK
              </Text>
            </Flex>

            <Flex
              flexDirection="column"
              order={{ base: 1, md: 2 }}
              alignItems={{ base: 'center', md: 'flex-end' }}
            >
              <form
                onSubmit={handleSubmit((values) =>
                  handleFindQuidditch(values, router)
                )}
              >
                <Flex alignItems="center">
                  <InputV2
                    id="postcode"
                    {...register('postcode')}
                    hideLabel
                    label="Postcode"
                    placeholder="Enter your postcode"
                    width="initial"
                  />
                  <Button type="submit" variant="secondary" ml={2} py={0}>
                    Find
                  </Button>
                </Flex>
              </form>

              <Flex justifyContent={{ base: 'center', md: 'flex-end' }} mt={5}>
                <IconWrapper
                  aria-label="Like us on Facebook"
                  href="https://www.facebook.com/quadballuk"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon as={FacebookIcon} />
                </IconWrapper>

                <IconWrapper
                  aria-label="Follow us on Twitter"
                  href="https://twitter.com/QuadballUK"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon as={TwitterIcon} />
                </IconWrapper>

                <IconWrapper
                  aria-label="Follow us on Instagram"
                  href="https://www.instagram.com/quadballuk"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon as={InstagramIcon} />
                </IconWrapper>

                <IconWrapper
                  aria-label="Subscribe to our Youtube Channel"
                  href="https://www.youtube.com/channel/UCef5ZmqGJvff6RIqA0KS0wQ"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon as={YoutubeIcon} />
                </IconWrapper>
              </Flex>
            </Flex>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};
export default Footer;
