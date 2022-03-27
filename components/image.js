import NextImage from 'next/image';
import { Box } from '@chakra-ui/react';

const ImageWithDefaults = ({
  alt,
  src,
  filter,
  borderRadius,
  clipPath,
  ...props
}) => {
  return (
    <Box
      sx={{
        '& img': {
          borderRadius: borderRadius ?? 'lg',
          clipPath: clipPath ?? 'initial',
          filter: filter ? 'brightness(0) invert(1)' : 'inherit',
        },
      }}
    >
      <NextImage
        src={src}
        alt={alt}
        objectFit="cover"
        objectPosition="center center"
        {...props}
      />
    </Box>
  );
};

export default ImageWithDefaults;
