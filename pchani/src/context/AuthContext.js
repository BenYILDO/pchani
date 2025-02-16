import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

// Mock kullanıcı verileri
const mockUsers = [
  {
    id: 1,
    email: 'test@example.com',
    password: 'test123',
    firstName: 'Test',
    lastName: 'User',
    avatar: null,
    phone: '0555 555 55 55',
    location: 'İstanbul',
    memberSince: '2024',
  },
  {
    id: 2,
    email: 'demo@example.com',
    password: 'demo123',
    firstName: 'Demo',
    lastName: 'User',
    avatar: null,
    phone: '0544 444 44 44',
    location: 'Ankara',
    memberSince: '2024',
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // LocalStorage'dan kullanıcı bilgisini kontrol et
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      // Mock API call
      setTimeout(() => {
        const foundUser = mockUsers.find(
          u => u.email === email && u.password === password
        );

        if (foundUser) {
          const userWithoutPassword = { ...foundUser };
          delete userWithoutPassword.password;
          
          setUser(userWithoutPassword);
          localStorage.setItem('user', JSON.stringify(userWithoutPassword));
          resolve(userWithoutPassword);
        } else {
          reject(new Error('E-posta veya şifre hatalı!'));
        }
      }, 1000);
    });
  };

  const register = (userData) => {
    return new Promise((resolve, reject) => {
      // Mock API call
      setTimeout(() => {
        const existingUser = mockUsers.find(u => u.email === userData.email);
        
        if (existingUser) {
          reject(new Error('Bu e-posta adresi zaten kullanımda!'));
          return;
        }

        const newUser = {
          id: mockUsers.length + 1,
          ...userData,
          memberSince: new Date().getFullYear().toString(),
          avatar: null,
        };

        mockUsers.push(newUser);
        
        const userWithoutPassword = { ...newUser };
        delete userWithoutPassword.password;

        setUser(userWithoutPassword);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        resolve(userWithoutPassword);
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = (updatedData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedUser = { ...user, ...updatedData };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        resolve(updatedUser);
      }, 1000);
    });
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 