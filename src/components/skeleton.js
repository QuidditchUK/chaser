import React from 'react';
import Skeleton from 'react-loading-skeleton';

const SkeletonComponent = () => (
  <>
    <Skeleton />
    <Skeleton count={5} />
  </>
);

export default SkeletonComponent;
