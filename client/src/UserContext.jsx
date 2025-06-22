import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [name, setName] = useState(() => localStorage.getItem('settings_name') || 'Liam');

  useEffect(() => {
    localStorage.setItem('settings_name', name);
  }, [name]);

  return (
    <UserContext.Provider value={{ name, setName }}>
      {children}
    </UserContext.Provider>
  );
}