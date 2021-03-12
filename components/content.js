import { Box } from '@chakra-ui/react';

export default function Content(props) {
  return (
    <Box
      lineHeight="24px"
      sx={{
        a: {
          textDecoration: 'none',
          wordBreak: 'break-all',

          '&:hover': {
            textDecoration: 'underline',
          },
        },
      }}
      {...props}
    />
  );
}
