import styled from '@emotion/styled';
import { Grid } from '@chakra-ui/react';

const Wrapper = styled.div`
  overflow-x: scroll;
  overflow-y: hidden;

  &::-webkit-scrollbar {
    display: none;
  }

  scrollbar-width: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    overflow-x: initial;
    overflow-y: initial;
  }
`;

const Spacer = styled.div`
  display: block;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const HorizontalScrollWrapper = ({
  horizontalScroll = false,
  itemsCount,
  children,
}) => (
  <>
    {horizontalScroll ? (
      <Wrapper>
        <Grid
          gridTemplateColumns={{
            base: `1rem repeat(${itemsCount}, calc(75% - 40px)) 2.5rem`,
            md: 'repeat(auto-fit, minmax(300px, 1fr))',
          }}
          gridGap={{ base: 4, md: 9 }}
        >
          <Spacer />
          {children}
          <Spacer />
        </Grid>
      </Wrapper>
    ) : (
      <Grid
        gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))"
        gridGap={{ base: 4, md: 9 }}
        px={{ base: 4, sm: 8, md: 0 }}
      >
        {children}
      </Grid>
    )}
  </>
);

export default HorizontalScrollWrapper;
