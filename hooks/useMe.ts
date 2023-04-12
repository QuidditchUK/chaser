import usersService from 'services/users';
import { SafeUserWithIncludes } from 'types/user';
import useCachedResponse from './useCachedResponse';

/**
 * Hook to fetch the current user
 */
export default function useMe() {
  const response = useCachedResponse<SafeUserWithIncludes>({
    queryKey: '/users/me',
    queryFn: usersService.getUser,
  });

  return response;
}
