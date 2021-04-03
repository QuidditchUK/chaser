import dynamic from 'next/dynamic';

const Navigation = dynamic(() => import('components/navigation'));
const Footer = dynamic(() => import('components/footer'));
const PreviewAlert = dynamic(() => import('components/preview-alert'), {
  ssr: false,
});

const Layout = ({ children, preview = false }) => {
  return (
    <>
      {preview && <PreviewAlert />}
      <Navigation />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
