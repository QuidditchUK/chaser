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
        py={{ base: 6, md: 0 }}
        sx={{
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
        }}
      >
        <Grid
          gridTemplateColumns={{
            base: `1rem repeat(${itemsCount}, calc(75% - 40px)) 2.5rem`,
            md: 'repeat(auto-fit, minmax(300px, 1fr))',
          }}
          gridGap={{ base: 4, md: 9 }}
          gridTemplateRows={{
            base: '1fr',
            md: `repeat(auto-fill, minmax(1fr, auto))`,
          }}
          gridAutoRows="1fr"
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
