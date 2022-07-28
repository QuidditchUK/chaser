import { useMutation } from 'react-query';

function isAxiosError(tdb) {
  if (tdb.response) {
    return true;
  }
  return false;
}

const dataSelector = (res) => res.data;

export default function useResponse(rawOptions) {
  const { queryFn, selector = dataSelector, ...options } = rawOptions;

  const mutationFn = async (context) => {
    try {
      const res = await queryFn(context);
      return selector(res);
    } catch (error) {
      if (!isAxiosError(error)) {
        throw error;
      }

      if (error?.response?.status === 401 || error?.response?.status === 403) {
        // handle 401s
      }
      throw error;
    }
  };

  return useMutation(mutationFn, options);
}
