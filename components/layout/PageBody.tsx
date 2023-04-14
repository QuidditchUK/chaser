import { Grid, GridProps } from '@chakra-ui/react';

export default function PageBody(props: GridProps) {
  return (
    <Grid
      gridTemplateColumns={{ base: '1fr', lg: '2fr 1fr' }}
      gridGap={4}
      gridTemplateAreas={{
        base: "'sidebar' 'main'",
        lg: "'main sidebar'",
      }}
      {...props}
    />
  );
}
