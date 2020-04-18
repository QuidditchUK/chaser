import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import get from 'just-safe-get';
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

export function usePageView(setMetadata) {
  const { pathname } = useLocation();

  useEffect(() => {
    setMetadata({ url: `${window.location.origin}${pathname}` });
  }, [pathname, setMetadata]);
}

export function usePrismicMeta(setMetadata, rawData) {
  const data = {
    subTitle: get(rawData, 'meta_title'),
    description: get(rawData, 'meta_description'),
    image: get(rawData, 'meta_image.url'),
  };

  useEffect(() => {
    if (rawData) {
      setMetadata(data);
    }
  }, [data, rawData, setMetadata]);
}
