import { Grid, Box } from '@chakra-ui/react';

const HorizontalScrollWrapper = ({
  horizontalScroll = false,
  itemsCount,
  children,
}) => (
  <>
    {horizontalScroll ? (
      <Box
        overflowX={{ base: 'scroll', md: 'initial' }}
        overflowY={{ base: 'hidden', md: 'initial' }}
        scrollbarWidth="none"
        sx={{ '&::-webkit-scrollbar': { display: 'none' } }}
      >
        <Grid
          gridTemplateColumns={{
            base: `1rem repeat(${itemsCount}, calc(75% - 40px)) 2.5rem`,
            md: 'repeat(auto-fit, minmax(300px, 1fr))',
          }}
          gridGap={{ base: 4, md: 9 }}
        >
          <Box display={{ base: 'block', md: 'none' }} />
          {children}
          <Box display={{ base: 'block', md: 'none' }} />
        </Grid>
      </Box>
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
