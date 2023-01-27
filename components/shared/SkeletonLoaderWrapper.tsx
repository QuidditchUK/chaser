import { VisuallyHidden } from '@chakra-ui/react';
import React, { ReactNode } from 'react';

export default function SkeletonLoaderWrapper({
  isLoading,
  loaderComponent,
  children,
}: {
  isLoading: boolean;
  loaderComponent?: ReactNode;
  children: ReactNode;
}) {
  if (isLoading) {
    return (
      <>
        <VisuallyHidden>Loading</VisuallyHidden>
        {loaderComponent}
      </>
    );
  }
  return <>{children}</>;
}
