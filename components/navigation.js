import { useState, useRef, useEffect, Fragment } from 'react';
import Link from 'next/link';
// import Router from 'next/router';
import dynamic from 'next/dynamic';

// import styled from '@emotion/styled';
// import cookies from 'js-cookie';

// import { tint, rgba } from 'polished';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import {
  Flex,
  Box,
  Menu,
  Button as ChakraButton,
  MenuList,
  MenuItem,
  MenuButton,
} from 'components';
import { MAIN_NAVIGATION, DASHBOARD_NAVIGATION } from 'constants/navigation';
// import { removeCookie } from 'modules/cookies';
// import ActiveLink, { ParentWrapper, ExactActiveLink } from 'components/active-link';
import { Logo, LogoLink } from 'components/logo';

const HamburgerIcon = dynamic(() => import('public/images/hamburger.svg'));
// const Button = dynamic(() => import('components/button'));

const logo = '/images/logo.png';
const logoText = '/images/logo-text.png';

const Header = (props) => (
  <Flex
    as="header"
    direction="row"
    height={{ base: '50px', lg: '60px' }}
    justifyContent="space-between"
    alignItems="center"
    color="monarchRed"
    bg="white"
    boxShadow="md"
    {...props}
  />
);

// const List = styled.ul`
//   align-items: center;
//   display: flex;
//   flex-direction: row;
//   list-style-type: none;
//   padding-left: 0;

//   a {
//     text-decoration: none;
//   }

//   span {
//     &.active {
//       color: ${({ theme }) => theme.colors.monarchRed};

//       @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
//         font-weight: 700;
//       }
//     }

//     &:hover {
//       color: ${({ theme }) => theme.colors.monarchRed};
//     }
//   }

//   li {
//     cursor: pointer;
//   }

//   ul {
//     display: flex;
//     flex-direction: column;
//     max-height:0;
//     overflow: hidden;
//     justify-content: flex-start;
//     transition: max-height 0.3s;
//     width: 0;
//     justify-content: flex-start;
//     position: absolute;
//     top: 35px;

//     @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
//       width: auto;
//     }
//   }

//   li:hover > ul,
//   li:focus > ul,
//   li ul:focus {
//     border-top: 25px solid ${rgba(0, 0, 0, 0)};
//     display: flex;
//     overflow: hidden;
//     flex-direction: column;
//     justify-content: flex-start;
//     position: absolute;
//     width: auto;
//     top: 35px;
//     z-index: 15;
//     max-height: 400px;

//     li {
//       background: ${({ theme }) => theme.colors.white};
//       box-shadow: 0 10px 0.625rem rgba(0,0,0,0.3);
//       width: 100%;

//       a {
//         color: ${({ theme, dashboard }) => (dashboard ? theme.colors.white : theme.colors.greyDark)};
//         display: block;
//         width: 100%;

//         &:hover {
//           color: ${({ theme }) => theme.colors.white};
//         }
//       }

//       span {
//         color: inherit;
//         display: block;
//         padding: ${({ theme }) => theme.space[4]} ${({ theme }) => theme.space[6]};
//         width: 100%;
//         font-weight: normal;

//         &:hover {
//           color: ${({ theme }) => theme.colors.white};
//         }

//         &.active {
//           background: ${({ theme }) => theme.colors.monarchRed};
//           color: ${({ theme }) => theme.colors.white};
//         }
//       }

//       &:hover {
//         background: ${({ theme }) => theme.colors.monarchRed};
//         color: ${({ theme }) => theme.colors.white};
//       }
//     }
//   }

//   @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
//     display: flex;
//     flex-direction: column;
//     height: 100vh;
//     top: 0;
//     justify-content: flex-start;
//     overflow-y:auto;
//     left: 0;
//     margin: 0;
//     padding: 60px ${({ theme }) => theme.space[4]} 120px;
//     position: absolute;
//     transform: ${({ open }) => (open ? 'translateX(0)' : 'translateX(-100%)')};
//     transition: transform 0.3s;
//     width: 100%;
//     z-index: 4;

//     span:hover {
//       color: ${({ theme }) => theme.colors.qukBlue};
//     }

//     li > ul,
//     ul,
//     li:hover > ul,
//     li:focus > ul,
//     li ul:focus {
//       background: unset;
//       border-top: 0;
//       display: block;
//       margin: initial;
//       max-height: 0;
//       overflow: hidden;
//       padding: initial;
//       position: initial;
//       transform: ${({ open }) => (open ? 'translateX(0)' : 'translateX(-100%)')};
//       transition: max-height 0.3s;

//       li {
//         box-shadow: none;
//         display: flex;
//         margin: ${({ theme }) => theme.space[3]} auto;
//         width: 100%;

//         a {
//           width: 100%;

//           &:hover {
//             color: ${({ theme }) => theme.colors.monarchRed};
//           }
//         }

//         span {
//           background: ${({ theme }) => tint(0.7, theme.colors.qukBlue)};
//           display: block;
//           padding: ${({ theme }) => theme.space[2]} 0;

//           &.active {
//             background: ${({ theme }) => theme.colors.qukBlue};
//             color: ${({ theme }) => theme.colors.white};

//             &:hover {
//               color: ${({ theme }) => theme.colors.qukBlue};
//             }
//           }

//           &:hover {
//             color: ${({ theme }) => theme.colors.qukBlue};
//           }
//         }
//       }

//       &.dropdown, .dropdown:hover {
//         height: auto;
//         max-height: 250px;
//       }
//     }
//   }
// `;

// const Item = (props) => (
//   <Box
//     as="li"
//     width="100%"
//     mb={{ base: 4, lg: 0 }}
//     sx={{
//       "&:first-of-type": {
//         pl: { base: 'initial', lg: 0 }
//       },
//       pl: { base: 0, lg: 4 },
//       "button": {
//         fontSize: "md",
//         width: "100%"
//       }
//     }}
//     {...props}
//   />
// );

// const NavItem = (props) => (
//   <Box
//     as="span"
//     fontWeight={{ base: "normal", lg: "bold" }}
//     fontSize={{ base: "md", lg: "sm", xl: "md" }}
//     borderRadius={{ base: "sm", lg: "none" }}
//     textAlign={{ base: 'center', lg: 'left' }}
//     display={{ base: 'block', lg: 'initial' }}
//     px={{ base: 4, lg: 'initial' }}
//     py={{ base: 2, lg: 'initial' }}
//     bg={{ base: 'white', lg: 'inherit' }}
//     _hover={{
//       color: 'qukBlue',
//       bg: { base: '#e6ebef', lg: 'inherit' }
//     }}
//     borderWidth="1px"
//     borderStyle="solid"
//     borderColor="white"
//     {...props}
//   />
// )

const Hamburger = (props) => (
  <Box
    display={{ base: 'block', lg: 'none' }}
    cursor="pointer"
    zIndex="7"
    position="absolute"
    top="10px"
    right="1rem"
    bg="inherit"
    {...props}
  />
);

// const Overlay = (props) => (<Box width="100%" height="100vh" bg="rgba(14, 55, 95, 0.9)" transition="transform 0.3s" zIndex="2" position="absolute" top={0} left={0} {...props} />)

function Navigation({ dashboard = false }) {
  // const loggedIn = cookies.get('AUTHENTICATION_TOKEN');
  const [open, setOpen] = useState(false);
  // const [navigationToggle, setNavigationToggle] = useState(1000);
  const navigation = dashboard ? DASHBOARD_NAVIGATION : MAIN_NAVIGATION;

  const scrollRef = useRef();

  useEffect(() => {
    if (open) {
      disableBodyScroll(scrollRef.current);
    } else {
      enableBodyScroll(scrollRef.current);
    }
  }, [open]);

  // const signOut = () => {
  //   removeCookie('AUTHENTICATION_TOKEN');
  //   Router.push('/');
  // };

  return (
    <Box position="relative" zIndex={open ? 7 : 5}>
      {/* <Overlay transform={open ? 'translateX(0)' : 'translateX(-100%)'} /> */}

      <Header bg={dashboard ? 'qukBlue' : 'white'} px={open ? 0 : 4}>
        <Flex
          bg={open ? 'qukBlue' : 'inherit'}
          px={open ? 4 : 0}
          height="50px"
          alignItems="center"
          zIndex="5"
          width={{ base: '100%', lg: 'initial' }}
        >
          <Link href="/" passHref>
            <LogoLink onClick={() => setOpen(false)}>
              <Logo
                src={logo}
                alt="Quidditch UK"
                filter={
                  open || dashboard ? 'brightness(0) invert(1)' : 'inherit'
                }
              />
              <Logo
                src={logoText}
                alt="Quidditch UK"
                filter={
                  open || dashboard ? 'brightness(0) invert(1)' : 'inherit'
                }
              />
            </LogoLink>
          </Link>
        </Flex>

        {navigation.map((item) => (
          <Fragment key={item.label}>
            {item.list ? (
              <Menu>
                <MenuButton as={ChakraButton}>{item.label}</MenuButton>
                <MenuList>
                  {item.list.map((subItem) => (
                    <MenuItem key={subItem.as}>{subItem.label}</MenuItem>
                  ))}
                </MenuList>
              </Menu>
            ) : (
              <ChakraButton>{item.label}</ChakraButton>
            )}
          </Fragment>
        ))}

        <Flex as="nav" alignItems="center">
          {/* <List open={open} ref={scrollRef}>
            {navigation.map((item, i) => (
              <Item key={item.label} pl={{ sm: 4, xl: 6 }}>
                {item.list
                  ? (
                    <ParentWrapper path={item.path} paths={item.paths}>
                      <NavItem onClick={() => setNavigationToggle(navigationToggle === i ? 1000 : i)} color={{ base: 'darkBlue', lg: dashboard ? 'white' : 'greyDark'}}>{item.label}</NavItem>
                    </ParentWrapper>
                  )
                  : (
                    <ActiveLink href={item.href} as={item.as}>
                      <NavItem onClick={() => setOpen(false)} color={{ base: 'darkBlue', lg: dashboard ? 'white' : 'greyDark' }}>{item.label}</NavItem>
                    </ActiveLink>
                  )}

                {item.list && (
                  <List className={`${navigationToggle === i ? 'dropdown' : ''}`}>
                    {item.list.map((subItem) => (
                      <Item key={subItem.as}>
                        <ActiveLink href={subItem.href} as={subItem.as}>
                          <NavItem onClick={() => setOpen(false)} color={{ base: 'darkBlue', lg: dashboard ? 'white' : 'greyDark' }}>{subItem.label}</NavItem>
                        </ActiveLink>
                      </Item>
                    ))}
                  </List>
                )}
              </Item>
            ))}

            <Item pl={8}><Link href="/find-quidditch" passHref><a><Button type="button" variant={dashboard ? 'secondary' : { base: 'secondary', lg: 'primary' }} onClick={() => setOpen(false)}>Find Quidditch</Button></a></Link></Item>

            {!loggedIn && (
              <Item pl={4}>
                <Link href="/login" passHref>
                  <a>
                    <Button type="button" variant="light" onClick={() => setOpen(false)} mb={{ base:4, lg: 0 }}>
                      Sign in
                    </Button>
                  </a>
                </Link>
              </Item>
            )}

            {loggedIn && (
              <Item pl={4}>
                <ParentWrapper path="/dashboard">
                  <NavItem onClick={() => setNavigationToggle(navigationToggle === 20 ? 1000 : 20)} color={{ base: 'darkBlue', lg: dashboard ? 'white' : 'greyDark' }} borderWidth="0"><Button type="button" variant="light" py={{ base:3, lg: 2 }}>My Account</Button></NavItem>
                </ParentWrapper>

                <List className={`${navigationToggle === 20 ? 'dropdown' : ''}`}>
                  <Item>
                    <ExactActiveLink href="/dashboard" as="/dashboard">
                      <NavItem onClick={() => setOpen(false)} color={{ base: 'darkBlue', lg: dashboard ? 'white' : 'greyDark' }}>Dashboard</NavItem>
                    </ExactActiveLink>
                  </Item>
                  <Item>
                    <ActiveLink href="/dashboard/account/info" as="/dashboard/account/info">
                      <NavItem onClick={() => setOpen(false)} color={{ base: 'darkBlue', lg: dashboard ? 'white' : 'greyDark' }}>My info</NavItem>
                    </ActiveLink>
                  </Item>
                  <Item>
                    <Link href="/" as="/">
                      <a>
                        <NavItem
                          onClick={() => {
                            setOpen(false);
                            signOut();
                          }}
                          color={{ base: 'darkBlue', lg: dashboard ? 'white' : 'greyDark' }}
                        >
                          Sign out
                        </NavItem>
                      </a>
                    </Link>
                  </Item>
                </List>
              </Item>
            )}
          </List> */}

          <Hamburger
            as={HamburgerIcon}
            color={open || dashboard ? 'white' : 'qukBlue'}
            aria-hidden="true"
            onClick={() => setOpen(!open)}
          />
        </Flex>
      </Header>
    </Box>
  );
}

export default Navigation;
