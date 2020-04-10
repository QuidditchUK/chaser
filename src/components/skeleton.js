import React from 'react';
import Skeleton from 'react-loading-skeleton';

const SkeletonComponent = () => (
  <div>
    <Skeleton />
    <Skeleton count={5} />
  </div>
);

export default SkeletonComponent;
