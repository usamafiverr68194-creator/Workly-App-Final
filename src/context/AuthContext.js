import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = (email, password) => {
    setIsLoading(true);
    setTimeout(() => {
      const mockUsers = [
        { id: 1, name: 'Admin User', email: 'admin@workly.com', password: 'admin123', role: 'super_admin', avatar: 'AU' },
        { id: 3, name: 'Marcus Rivera', email: 'marcus@workly.com', password: 'pass123', role: 'worker', avatar: 'MR' },
        { id: 2, name: 'Sarah Johnson', email: 'sarah@workly.com', password: 'pass123', role: 'team_lead', avatar: 'SJ' },
      ];
      const foundUser = mockUsers.find(u => u.email === email && u.password === password);
      if (foundUser) {
        setUser(foundUser);
      }
      setIsLoading(false);
    }, 800);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
