import NextImage from 'next/image';
import { chakra } from '@chakra-ui/react';

const Image = chakra(NextImage, {
  baseStyle: {
    maxH: 120,
    maxW: 120,
    objectFit: 'cover',
    objectPosition: 'center center',
    borderRadius: '8px',
  },
  shouldForwardProp: (prop) =>
    ['width', 'height', 'src', 'alt', 'objectFit', 'objectPosition'].includes(
      prop
    ),
});

export default Image;
