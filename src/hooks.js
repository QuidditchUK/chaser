import { useState, useEffect } from 'react';
import { Client } from './modules/prismic';

export function usePrismicFetch(type, uid) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUrl() {
      const response = await Client().getByUID(type, uid);
      setData(response);
      setLoading(false);
    }

    fetchUrl();
  }, [type, uid]);

  return [data, loading];
}
