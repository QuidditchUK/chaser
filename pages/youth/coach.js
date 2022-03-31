import dynamic from 'next/dynamic';

const Meta = dynamic(() => import('components/shared/meta'));
const YouthForm = dynamic(() => import('components/prismic/forms/youth-form'));

const Page = () => (
  <>
    <Meta title="Apply to be a Youth Coach" />
    <YouthForm />
  </>
);

export default Page;
