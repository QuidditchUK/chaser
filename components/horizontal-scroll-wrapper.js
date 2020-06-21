import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Grid } from 'components/layout';

const Wrapper = styled.div`
  overflow-x: scroll;
  overflow-y: hidden;

  &::-webkit-scrollbar {
    display: none;
  }

  scrollbar-width: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.m}) {
    overflow-x: initial;
    overflow-y: initial;
  }
`;

const Spacer = styled.div`
  display: block;

   @media (min-width: ${({ theme }) => theme.breakpoints.m}) {
    display: none;
  }
`;

const HorizontalScrollWrapper = ({ horizontalScroll, itemsCount, children }) => (
  <>
    {horizontalScroll
      ? (
        <Wrapper>
          <Grid
            gridTemplateColumns={{ _: `1rem repeat(${itemsCount}, calc(75% - 40px)) 2.5rem`, m: 'repeat(auto-fit, minmax(300px, 1fr))' }}
            gridGap={{ _: 'gutter._', m: 'gutter.m' }}
          >
            <Spacer />
            {children}
            <Spacer />
          </Grid>
        </Wrapper>
      )
      : (
        <Grid
          gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))"
          gridGap={{ _: 'gutter._', m: 'gutter.m' }}
          px={{ _: 'gutter._', s: 'gutter.s', m: 0 }}
        >
          {children}
        </Grid>
      )}
  </>
);

HorizontalScrollWrapper.defaultProps = {
  horizontalScroll: false,
  itemCount: 0,
};

HorizontalScrollWrapper.propTypes = {
  horizontalScroll: PropTypes.bool,
  itemsCount: PropTypes.number,
  children: PropTypes.node.isRequired
};

export default HorizontalScrollWrapper;