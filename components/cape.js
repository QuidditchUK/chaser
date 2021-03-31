import { Grid, Image } from '@chakra-ui/react';
import Fonts from 'styles/fonts';

const music = '/media/hedwig.mp3';

export const Cape = () => (
  <>
    <Fonts />
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
      gridTemplateColumns={{ base: '100px 1fr 100px', md: '200px 1fr 200px' }}
      gridTemplateRows={{ base: '100px 1fr 100px', md: '200px 1fr 200px' }}
      pointerEvents="none"
    >
      <Image
        src="/media/quidditch.gif"
        height={{ base: 100, md: 200 }}
        width={{ base: 100, md: 200 }}
        alt="Harry on his broom"
      />
      <div />
      <Image
        src="/media/weasley.gif"
        height={{ base: 100, md: 200 }}
        width={{ base: 100, md: 200 }}
        alt="Badge for weasley is our king"
      />

      <div />
      <div />
      <div />

      <Image
        src="/media/jay.gif"
        height={{ base: 100, md: 200 }}
        width={{ base: 100, md: 200 }}
        alt="A swan, swanning about"
      />
      <div />
      <Image
        src="/media/glasses.gif"
        height={{ base: 75, md: 150 }}
        width={{ base: 75, md: 150 }}
        alt="A scar and glasses"
      />
    </Grid>
  </>
);

export default Cape;
