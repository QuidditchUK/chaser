import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Auth({ skeleton, children }) {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated: () => {
      router.push('/login');
    },
  });

  if (status === 'loading') {
    return skeleton || <></>;
  }

  return children;
}
