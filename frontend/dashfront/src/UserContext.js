// src/UserContext.js
import { createContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  return (
    <UserContext.Provider value={{ profileImageUrl, setProfileImageUrl }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
