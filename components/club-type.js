import { Text } from '@chakra-ui/react';

export const TYPES = {
  University: 'keeperGreen',
  Community: 'northernMagenta',
  Youth: 'southernBlue',
};

export default function Type(props) {
  return (
    <Text
      as="span"
      color="white"
      textTransform="uppercase"
      borderRadius="md"
      py={1}
      px={2}
      {...props}
    />
  );
}
