import { Flex, useBreakpointValue } from '@chakra-ui/react';

import Image from 'components/shared/image';

export default function Logo({ filter = false }) {
  const logoHeight = useBreakpointValue({ base: 35, xl: 45 }) || 35;
  const logoTextWidth = useBreakpointValue({ base: 175, xl: 225 }) || 175;

  return (
    <Flex alignItems="center">
      <Image
        priority={true}
        layout="fixed"
        height={logoHeight}
        width={logoHeight}
        src="/images/logo.png"
        alt="Quadball UK"
        filter={filter ? 'brightness(0) invert(1)' : false}
      />
      <Image
        priority={true}
        layout="fixed"
        height={logoHeight}
        width={logoTextWidth}
        src="/images/logo-text2.png"
        alt="Quadball UK"
        filter={filter ? 'brightness(0) invert(1)' : false}
      />
    </Flex>
  );
}
