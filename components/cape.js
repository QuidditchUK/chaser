import { Grid } from '@chakra-ui/react';

const music = '/media/hedwig.mp3';

export const Cape = () => (
  <>
    <audio autoPlay loop>
      <source src={music} />
    </audio>

    <Grid
      w="100%"
      h="100vh"
      zIndex="200"
      position="fixed"
      top="0"
      left="0"
      pt="60px"
      gridTemplateColumns="200px 1fr 200px"
      gridTemplateRows="200px 11fr 200px"
      pointerEvents="none"
    >
      <img
        src="/media/quidditch.gif"
        height={200}
        width={200}
        alt="Harry on his broom"
      />
      <div />
      <img
        src="/media/weasley.gif"
        height={200}
        width={200}
        alt="Badge for weasley is our king"
      />

      <div />
      <div />
      <div />

      <img
        src="/media/jay.gif"
        height={200}
        width={200}
        alt="A swan, swanning about"
      />
      <div />
      <img
        src="/media/glasses.gif"
        height={150}
        width={150}
        alt="A scar and glasses"
      />
    </Grid>
  </>
);

export default Cape;
