import { useEffect, useState } from 'react';

const useCapeMode = () => {
  const [theme, setTheme] = useState('normal');

  const setMode = (mode) => {
    localStorage.setItem('theme', mode);
    setTheme(mode);
  };

  const themeToggler = () => (theme === 'normal' ? setMode('normal') : setMode('cape'));

  useEffect(() => {
    const localTheme = localStorage.getItem('theme');
    return localTheme && setTheme(localTheme);
  }, []);

  return [theme, themeToggler];
};

export default useCapeMode;
