import React, { useState, useEffect } from 'react';
import { UserContext } from './contexts';

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
