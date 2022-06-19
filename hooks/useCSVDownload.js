import { saveAs } from 'file-saver';
import { useState } from 'react';

export default function useCSVDownload({
  data,
  filename = 'download.csv',
  separator = ',',
  type = 'text/csv;charset=utf-8;',
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(undefined);

  return {
    call: () => {
      setIsLoading(true);
      setError(undefined);

      try {
        const content = data.map((row) => row.join(separator)).join('\n');
        setIsLoading(false);
        saveAs(new Blob([content], { type }), filename);
      } catch (error) {
        setIsLoading(false);
        setError(error);
        throw error;
      }
    },
    isLoading,
    error,
    reset: () => {
      setError(undefined);
      setIsLoading(false);
    },
  };
}
