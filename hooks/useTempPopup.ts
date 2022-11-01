import { useState, useEffect, Dispatch, SetStateAction } from 'react';

const useTempPopup = (): [string, Dispatch<SetStateAction<string>>] => {
  const [popup, setPopup] = useState<string>(null);

  useEffect(() => {
    if (popup) {
      const timer = setTimeout(() => {
        setPopup(null);
      }, 5000);
      return () => clearTimeout(timer);
    }

    return () => {};
  }, [popup]);

  return [popup, setPopup];
};

export default useTempPopup;
