import { useState, useEffect } from 'react';

const useTempPopup = () => {
  const [popup, setPopup] = useState(null);

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
