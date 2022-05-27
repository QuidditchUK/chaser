import dynamic from 'next/dynamic';
import { getBasePageProps } from 'modules/prismic';

const Meta = dynamic(() => import('components/shared/meta'));
const YouthForm = dynamic(() => import('components/prismic/forms/youth-form'));

const Page = () => (
  <>
    <Meta title="Apply to be a Youth Coach" />
    <YouthForm />
  </>
);

export const getServerSideProps = async () => {
  const basePageProps = await getBasePageProps();

  return {
    props: basePageProps,
  };
};

export default Page;
