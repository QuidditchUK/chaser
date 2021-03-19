import { Box } from '@chakra-ui/react';
import Image from 'components/image';

const calcAspectRatio = (height, width) => (height / width) * 100 || null;

const ResponsiveImage = ({ src, alt, width, height, priority }) => {
  const aspectRatio = calcAspectRatio(height, width);

  return (
    <Box position="relative" width="100%" pb={`${aspectRatio}%`}>
      <Box width="100%">
        <Image
          src={src}
          alt={alt}
          layout="fill"
          objectPosition="center center"
          objectFit="cover"
          borderRadius={0}
          priority={priority}
        />
      </Box>
    </Box>
  );
};

export default ResponsiveImage;
