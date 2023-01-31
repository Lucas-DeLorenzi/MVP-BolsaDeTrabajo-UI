import React, { createContext, useEffect, useState } from "react";

const DarkModeContext = createContext();

const DarkModeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => {
    localStorage.setItem("dark-mode", JSON.stringify(!darkMode));
    setDarkMode(!darkMode);
  };
  useEffect(() => {
    const dark = localStorage.getItem("dark-mode");
    if (dark !== null) {
      setDarkMode(JSON.parse(dark));
    }
  }, []);

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};
export { DarkModeContext, DarkModeProvider };
