import React from 'react';
import styled from 'styled-components';
import { Box } from './layout';
import Container from './container';
import ActiveLink, { ExactActiveLink } from './active-link';

const NewsHeaderWrapper = styled(Box)`
  border-top: 1px solid ${({ theme }) => theme.colors.greyLight};
  display: flex;
  align-items: center;
  overflow-y: hidden;
`;

const List = styled.ul`
  align-items: center;
  display: flex;
  list-style-type: none;
  padding-left: 0;
  justify-content: space-between;
`;

const ListItem = styled.li`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.greyDark};
  padding: 0;

  a {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.greyDark};

    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }

    .active {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const NewsHeader = () => (
  <NewsHeaderWrapper
    bg="white"
    width="100%"
    height="60px"
  >
    <Container px={{ _: 6 }} maxWidth={{ _: '100%', m: '500px' }}>
      <List>
        <ListItem>
          <ExactActiveLink href="/news" as="/news"><span>All</span></ExactActiveLink>
        </ListItem>
        <ListItem>
          <ActiveLink href="/news/community" as="/news/community"><span>Community</span></ActiveLink>
        </ListItem>
        <ListItem>
          <ActiveLink href="/news/university" as="/news/university"><span>University</span></ActiveLink>
        </ListItem>
        <ListItem>
          <ActiveLink href="/news/executive" as="/news/executive"><span>Executive</span></ActiveLink>
        </ListItem>
      </List>
    </Container>
  </NewsHeaderWrapper>
);

export default NewsHeader;
