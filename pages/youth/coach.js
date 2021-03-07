import dynamic from 'next/dynamic';

const Meta = dynamic(() => import('components/meta'));
const YouthForm = dynamic(() => import('components/youth-form'));

const Page = () => (
  <>
    <Meta title="Apply to be a Youth Coach" />
    <YouthForm />
  </>
);

export default Page;
