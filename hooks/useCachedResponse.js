import { useQuery } from 'react-query';

function isAxiosError(tdb) {
  if (tdb.response) {
    return true;
  }
  return false;
}

const dataSelector = (res) => res.data;

export default function useCachedResponse(rawOptions) {
  const { queryFn, selector = dataSelector, ...options } = rawOptions;

  return useQuery({
    queryFn: async (context) => {
      try {
        const res = await queryFn(context);
        return selector(res);
      } catch (error) {
        if (!isAxiosError(error)) {
          throw error;
        }

        if (
          error?.response?.status === 401 ||
          error?.response?.status === 403
        ) {
          // handle 401s
        }
        throw error;
      }
    },
    ...options,
  });
}
