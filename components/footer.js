import React from 'react';
import styled from 'styled-components';
import { space } from 'styled-system';
import Link from 'next/link';
import { Formik, Form, Field } from 'formik';
import { useRouter } from 'next/router';
import ActiveLink from 'components/active-link';
import {
  Box, Grid, GridItem, Flex,
} from 'components/layout';
import { Logo, LogoLink } from 'components/logo';
import Container from 'components/container';
import Heading from 'components/heading';
import Input from 'components/input';
import Button from 'components/button';
import { rem } from 'styles/theme';
import FacebookIcon from 'public/images/facebook.svg';
import TwitterIcon from 'public/images/twitter.svg';
import InstagramIcon from 'public/images/instagram.svg';
import YoutubeIcon from 'public/images/youtube.svg';

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

  svg {
      color: ${({ theme }) => theme.colors.greyLight};
      height: 30px;
      width: 30px;
    }

    &:hover {
      svg {
        color: ${({ theme }) => theme.colors.secondary};
      }
    }
`;
export const Footer = () => {
  const router = useRouter();
  return (
    <footer>
      <Box
        bg="primary"
        color="white"
        py={{ _: 2, l: 5 }}
        px={{ _: 'gutter._', s: 'gutter.s', m: 'gutter.m' }}
      >
        <Container pb={3}>
          <Grid
            gridTemplateColumns={{ _: '1fr 1fr', m: '1fr 1fr 1fr 1fr' }}
            gridGap={{ _: 'gutter._', m: 'gutter.m' }}
          >
            <GridItem>
              <Heading as="h3" color="white">
                Information
              </Heading>

              <List>
                <Item><ActiveLink as="/about/contact-us" href="/about/[id]"><span>Contact Us</span></ActiveLink></Item>
                <Item><ActiveLink as="/about/leadership" href="/about/[id]"><span>Leadership</span></ActiveLink></Item>
                <Item><ActiveLink as="/find-quidditch" href="/find-quidditch"><span>All Clubs</span></ActiveLink></Item>
                <Item><a href="https://docs.google.com/spreadsheets/d/1QuGPhsj_LV81dRCXVRKHpdYvj9IrrupcxH9c8LWXZuE" target="_blank" rel="noopener noreferrer"><span>Results</span></a></Item>
                <Item><ActiveLink as="/about/fees" href="/about/[id]"><span>Season Fees</span></ActiveLink></Item>
              </List>
            </GridItem>

            <GridItem>
              <Heading as="h3" color="white">
                Partners
              </Heading>

              <List>
                <Item><a href="http://www.enricheducationuk.com/quidditch/" target="_blank" rel="noopener noreferrer"><span>Enrich Education</span></a></Item>
                <Item><a href="https://www.epionemedical.com/" target="_blank" rel="noopener noreferrer"><span>Epione Medical</span></a></Item>
                <Item><a href="https://www.utilityapparel.com/" target="_blank" rel="noopener noreferrer"><span>Utility Apparel</span></a></Item>
                <Item><a href="https://quidditcheurope.wixsite.com/quidditcheurope" target="_blank" rel="noopener noreferrer"><span>Quidditch Europe</span></a></Item>
                <Item><a href="https://iqasport.com" target="_blank" rel="noopener noreferrer"><span>International Quidditch Association</span></a></Item>
                <Item><a href="https://quidditchpremierleague.com" target="_blank" rel="noopener noreferrer"><span>Quidditch Premier League</span></a></Item>
              </List>
            </GridItem>

            <GridItem>
              <Heading as="h3" color="white">
                Programmes
              </Heading>

              <List>
                <Item><ActiveLink as="/programmes/national-teams" href="/programmes/[id]"><span>National Teams</span></ActiveLink></Item>
                <Item><ActiveLink as="/programmes/grants" href="/programmes/[id]"><span>Grants</span></ActiveLink></Item>
                <Item><ActiveLink as="/programmes/level-up" href="/programmes/[id]"><span>Level Up</span></ActiveLink></Item>
              </List>
            </GridItem>

            <GridItem>
              <Heading as="h3" color="white">
                Disclaimer
              </Heading>

              <Support>
                QuidditchUK and its activities are not licensed by, sponsored by or associated with Warner Bros., J.K. Rowling or their affiliates.  ‘Quidditch,’ ‘Harry Potter’ and all related names, characters and indicia are trademarks of and &copy; Warner Bros. – Harry Potter publishing rights &copy; J.K. Rowling.
              </Support>

              <Support>
                QuidditchUK is a Non-Profit Company Registered in England and Wales, Company Registration No. 12178866
              </Support>
            </GridItem>
          </Grid>
        </Container>

        <Container borderTop="3px solid white" py={5} textAlign={{ _: 'center', m: 'left' }}>
          <Grid
            gridTemplateColumns={{ _: '1fr', m: '4fr 2fr' }}
            gridGap={{ _: 'gutter._', m: 'gutter.m' }}
          >
            <Flex flexDirection="column" order={{ _: 2, m: 1 }}>
              <Link href="/" passHref>
                <LogoLink>
                  <>
                    <Logo src={logo} alt="Quidditch UK" white />
                    <Logo src={logoText} alt="Quidditch UK" white />
                  </>
                </LogoLink>
              </Link>

              <Support>All Rights Reserved &copy; {year} QuidditchUK</Support>
            </Flex>

            <Flex flexDirection="column" order={{ _: 1, m: 2 }} alignItems={{ _: 'center', m: 'flex-end' }}>
              <Flex>
                <Formik
                  initialValues={{ postcode: '' }}
                  onSubmit={({ postcode }) => router.push(`/find-quidditch${postcode ? `?postcode=${postcode}` : ''}`).then(() => window.scrollTo(0, 0))}
                >
                  <Form>
                    <Field as={Input} placeholder="Enter your postcode" name="postcode" aria-label="Find Quidditch" /><Button type="submit" variant="secondary" ml={2}>Find</Button>
                  </Form>
                </Formik>
              </Flex>

              <Flex justifyContent={{ _: 'center', m: 'flex-end' }} mt={5}>
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
                  pl={{ _: 5, m: 3 }}
                >
                  <TwitterIcon />
                </Icon>

                <Icon
                  aria-label="Follow us on Instagram"
                  href="https://instagram.com/ukquidditch"
                  target="_blank"
                  rel="noopener noreferrer"
                  pl={{ _: 5, m: 3 }}
                >
                  <InstagramIcon />
                </Icon>

                <Icon
                  aria-label="Subscribe to our Youtube Channel"
                  href="https://www.youtube.com/channel/UCef5ZmqGJvff6RIqA0KS0wQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  pl={{ _: 5, m: 3 }}
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
