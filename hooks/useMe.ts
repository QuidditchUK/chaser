import usersService from 'services/users';
import { SafeUserWithTransfersAndScopes } from 'types/user';
import useCachedResponse from './useCachedResponse';

/**
 * Hook to fetch the current user
 */
export default function useMe() {
  const response = useCachedResponse<SafeUserWithTransfersAndScopes>({
    queryKey: '/users/me',
    queryFn: usersService.getUser,
    selector: (res) => res.data.user,
  });

  return response;
}
