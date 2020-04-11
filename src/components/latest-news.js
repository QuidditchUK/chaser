import React from 'react';
import { Grid, GridItem, Box } from './layout';
import Card from './card';
import Image from './image';
import Container from './container';

const LatestNews = () => (
  <Box bg="greyLight">
    <Container pt={10} pb={10}>
      <Grid
        gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))"
        gridGap={{ _: 'gutter._', m: 'gutter.m' }}
      >
        <GridItem>
          <Card
            variant="light"
            name="Development Cup review: OUQC take gold"
            description="The Radcliffe Chimeras, London Unbreakables and Bangor Broken Broomsticks secured berths at the British Quidditch Cup after medalling at Development Cup, held at Salford Sports Village on 7/8 March."
            image={(
              <Image
                src="1.jpg"
                alt="Test"
                width={1600}
                height={900}
              />
        )}
          />
        </GridItem>

        <GridItem>
          <Card
            variant="light"
            name="QuidditchUK 19/20 Season & COVID-19 Updates"
            description="A word from the QUK Leadership Team"
            image={(
              <Image
                src="2.jpg"
                alt="Test"
                width={1600}
                height={900}
              />
        )}
          />
        </GridItem>

        <GridItem>
          <Card
            variant="light"
            name="Molly Maurice-Smith Looks For Successor In Human Resources"
            description="Molly Maurice-Smith, one of the longest running members of QuidditchUK’s current Executive Management Team has stepped down."
            image={(
              <Image
                src="3.jpg"
                alt="Test"
                width={1600}
                height={900}
              />
        )}
          />
        </GridItem>
      </Grid>
    </Container>
  </Box>
);

export default LatestNews;
