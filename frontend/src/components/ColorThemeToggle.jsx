import { useState, useEffect } from 'react';

const ColorThemeToggle = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
<button
  onClick={toggleTheme}
  className="w-12 h-12 mb-4 p-2 bg-accent dark:bg-highlight-color text-black dark:text-white rounded-full shadow-lg transition-colors duration-300 ease-in-out fixed top-4 right-4">
  {theme === 'light' ? '🌙' : '☀️'}
</button>
  );
};

export default ColorThemeToggle;