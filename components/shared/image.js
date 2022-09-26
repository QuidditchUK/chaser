import NextImage from 'next/image';
import { PrismicNextImage } from '@prismicio/next';
import { Box } from '@chakra-ui/react';

const ImageWrapper = ({ borderRadius, clipPath, filter, children }) => (
  <Box
    sx={{
      '& img': {
        borderRadius: borderRadius ?? 'lg',
        clipPath: clipPath ?? 'initial',
        filter: filter ?? 'inherit',
      },
    }}
  >
    {children}
  </Box>
);

export const PrismicImageWithDefaults = ({
  field,
  filter,
  borderRadius,
  clipPath,
  ...props
}) => {
  return (
    <ImageWrapper
      borderRadius={borderRadius}
      filter={filter}
      clipPath={clipPath}
    >
      <PrismicNextImage
        objectFit="cover"
        objectPosition="center center"
        field={field}
        {...props}
      />
    </ImageWrapper>
  );
};

const ImageWithDefaults = ({
  alt,
  src,
  filter,
  borderRadius,
  clipPath,
  ...props
}) => {
  return (
    <ImageWrapper
      borderRadius={borderRadius}
      filter={filter}
      clipPath={clipPath}
    >
      <NextImage
        src={src}
        alt={alt}
        objectFit="cover"
        objectPosition="center center"
        {...props}
      />
    </ImageWrapper>
  );
};

export default ImageWithDefaults;
