import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import useFeature from 'hooks/useFeature';
import { useRouter } from 'next/router';

const Meta = dynamic(() => import('components/meta'));
const YouthForm = dynamic(() => import('components/youth-form'));

const Page = () => {
  const showForm = useFeature('coach-form');
  const router = useRouter();

  useEffect(() => {
    if (!showForm) {
      router.push('/');
    }
  }, [showForm, router]);

  return (
    <>
      <Meta
        title="Youth interest form"
      />
      {showForm && <YouthForm />}
    </>
  );
};

export default Page;
