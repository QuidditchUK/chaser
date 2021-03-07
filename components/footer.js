import styled from '@emotion/styled';
import { space } from 'styled-system';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Formik, Form, Field } from 'formik';
import { useRouter } from 'next/router';
import { Box, Grid, Flex, Link as ChakraLink } from 'components';
import { Logo } from 'components/logo';
import { rem } from 'styles/theme';
import Input from 'components/input';

const ActiveLink = dynamic(() => import('components/active-link'));
const Container = dynamic(() => import('components/container'));
const Heading = dynamic(() => import('components/heading'));
const Button = dynamic(() => import('components/button'));
const FacebookIcon = dynamic(() => import('public/images/facebook.svg'));
const TwitterIcon = dynamic(() => import('public/images/twitter.svg'));
const InstagramIcon = dynamic(() => import('public/images/instagram.svg'));
const YoutubeIcon = dynamic(() => import('public/images/youtube.svg'));
const VercelLogo = dynamic(() => import('public/images/powered-by-vercel.svg'));

const logo = '/images/logo.png';
const logoText = '/images/logo-text.png';

const year = new Date().getFullYear();

const List = styled.ul`
  list-style-type: none;
  padding-left: 0;
`;

const Item = styled.li`
  line-height: ${rem(32)};

  a {
    text-decoration: none;
  }

  span {
    color: ${({ theme }) => theme.colors.white};

    &:hover {
      border-bottom: 2px solid ${({ theme }) => theme.colors.white};
    }

    &.active {
      font-weight: 700;
    }
  }
`;

const Support = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.bodyCard};
`;

const Icon = styled.a`
  ${space};
  margin-left: ${({ theme }) => theme.space[2]};

  svg {
    color: ${({ theme }) => theme.colors.greyLight};
    height: 30px;
    width: 30px;
  }

  &:hover {
    svg {
      color: ${({ theme }) => theme.colors.monarchRed};
    }
  }
`;

const Vercel = styled.a`
  color: ${({ theme }) => theme.colors.qukBlue};
  svg {
    width: 60%;
  }
`;

export const Footer = () => {
  const router = useRouter();
  return (
    <footer>
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
            <Box>
              <Heading as="h3" color="white">
                Information
              </Heading>

              <List>
                <Item>
                  <ActiveLink as="/about/contact-us" href="/about/[id]">
                    <span>Contact Us</span>
                  </ActiveLink>
                </Item>
                <Item>
                  <ActiveLink as="/about/leadership" href="/about/[id]">
                    <span>Leadership</span>
                  </ActiveLink>
                </Item>
                <Item>
                  <ActiveLink as="/find-quidditch" href="/find-quidditch">
                    <span>All Clubs</span>
                  </ActiveLink>
                </Item>
                <Item>
                  <a
                    href="https://docs.google.com/spreadsheets/d/1QuGPhsj_LV81dRCXVRKHpdYvj9IrrupcxH9c8LWXZuE"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>Results</span>
                  </a>
                </Item>
                <Item>
                  <ActiveLink as="/about/fees" href="/about/[id]">
                    <span>Season Fees</span>
                  </ActiveLink>
                </Item>
                <Item>
                  <ActiveLink as="/newsletters-archive" href="/[id]">
                    <span>Newsletters</span>
                  </ActiveLink>
                </Item>
              </List>
            </Box>

            <Box>
              <Heading as="h3" color="white">
                Partners
              </Heading>

              <List>
                <Item>
                  <a
                    href="http://www.enricheducationuk.com/quidditch/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>Enrich Education</span>
                  </a>
                </Item>
                <Item>
                  <a
                    href="https://www.epionemedical.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>Epione Medical</span>
                  </a>
                </Item>
                <Item>
                  <a
                    href="https://www.utilityapparel.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>Utility Apparel</span>
                  </a>
                </Item>
                <Item>
                  <a
                    href="https://quidditcheurope.wixsite.com/quidditcheurope"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>Quidditch Europe</span>
                  </a>
                </Item>
                <Item>
                  <a
                    href="https://iqasport.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>International Quidditch Association</span>
                  </a>
                </Item>
                <Item>
                  <a
                    href="https://quidditchpremierleague.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>Quidditch Premier League</span>
                  </a>
                </Item>
              </List>
            </Box>

            <Box>
              <Heading as="h3" color="white">
                Programmes
              </Heading>

              <List>
                <Item>
                  <ActiveLink
                    as="/programmes/national-teams"
                    href="/programmes/[id]"
                  >
                    <span>National Teams</span>
                  </ActiveLink>
                </Item>
                <Item>
                  <ActiveLink as="/programmes/grants" href="/programmes/[id]">
                    <span>Grants</span>
                  </ActiveLink>
                </Item>
              </List>
            </Box>

            <Box>
              <Heading as="h3" color="white">
                Disclaimer
              </Heading>

              <Support>
                QuidditchUK and its activities are not licensed by, sponsored by
                or associated with Warner Bros., J.K. Rowling or their
                affiliates. ‘Quidditch,’ ‘Harry Potter’ and all related names,
                characters and indicia are trademarks of and &copy; Warner Bros.
                – Harry Potter publishing rights &copy; J.K. Rowling.
              </Support>

              <Support>
                QuidditchUK is a Non-Profit Company Registered in England and
                Wales, Company Registration No. 12178866
              </Support>

              {/* <Flex alignItems="center" justifyContent="left"> */}
              <Vercel
                aria-label="Vercel"
                href="https://vercel.com/?utm_source=quidditchuk&utm_campaign=oss"
                target="_blank"
                rel="noopener noreferrer"
              >
                <VercelLogo />
              </Vercel>
              {/* </Flex> */}
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
            <Flex flexDirection="column" order={{ base: 2, md: 1 }}>
              <Link href="/" passHref>
                <ChakraLink height={{ base: '35px', xl: '45px' }} zIndex="5">
                  <>
                    <Logo
                      src={logo}
                      alt="Quidditch UK"
                      filter="brightness(0) invert(1)"
                    />
                    <Logo
                      src={logoText}
                      alt="Quidditch UK"
                      filter="brightness(0) invert(1)"
                    />
                  </>
                </ChakraLink>
              </Link>

              <Support>All Rights Reserved &copy; {year} QuidditchUK</Support>
            </Flex>

            <Flex
              flexDirection="column"
              order={{ base: 1, md: 2 }}
              alignItems={{ base: 'center', md: 'flex-end' }}
            >
              <Flex>
                <Formik
                  initialValues={{ postcode: '' }}
                  onSubmit={({ postcode }) =>
                    router
                      .push(
                        `/find-quidditch${
                          postcode ? `?postcode=${postcode}` : ''
                        }`
                      )
                      .then(() => window.scrollTo(0, 0))
                  }
                >
                  <Form>
                    <Field
                      as={Input}
                      placeholder="Enter your postcode"
                      name="postcode"
                      aria-label="Find Quidditch"
                    />
                    <Button type="submit" variant="secondary" ml={2}>
                      Find
                    </Button>
                  </Form>
                </Formik>
              </Flex>

              <Flex justifyContent={{ base: 'center', md: 'flex-end' }} mt={5}>
                <Icon
                  aria-label="Like us on Facebook"
                  href="https://www.facebook.com/QuidditchUK"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FacebookIcon />
                </Icon>

                <Icon
                  aria-label="Follow us on Twitter"
                  href="https://twitter.com/QuidditchUK"
                  target="_blank"
                  rel="noopener noreferrer"
                  pl={{ base: 5, md: 3 }}
                >
                  <TwitterIcon />
                </Icon>

                <Icon
                  aria-label="Follow us on Instagram"
                  href="https://instagram.com/ukquidditch"
                  target="_blank"
                  rel="noopener noreferrer"
                  pl={{ base: 5, md: 3 }}
                >
                  <InstagramIcon />
                </Icon>

                <Icon
                  aria-label="Subscribe to our Youtube Channel"
                  href="https://www.youtube.com/channel/UCef5ZmqGJvff6RIqA0KS0wQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  pl={{ base: 5, md: 3 }}
                >
                  <YoutubeIcon />
                </Icon>
              </Flex>
            </Flex>
          </Grid>
        </Container>
      </Box>
    </footer>
  );
};
export default Footer;
