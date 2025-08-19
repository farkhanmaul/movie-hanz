import { useState, useEffect } from 'react';

const THEME_KEY = 'moviehanz-theme';
const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
};

export const useTheme = () => {
  const [isLightMode, setIsLightMode] = useState(() => {
    // Check localStorage first, then system preference
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) {
      return savedTheme === THEMES.LIGHT;
    }
    return window.matchMedia('(prefers-color-scheme: light)').matches;
  });

  useEffect(() => {
    // Apply theme to body class
    if (isLightMode) {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }

    // Save to localStorage
    localStorage.setItem(THEME_KEY, isLightMode ? THEMES.LIGHT : THEMES.DARK);
  }, [isLightMode]);

  const toggleTheme = () => {
    setIsLightMode(prev => !prev);
  };

  return {
    isLightMode,
    toggleTheme,
    theme: isLightMode ? THEMES.LIGHT : THEMES.DARK
  };
};