import React, { createContext, useState, useContext, useEffect } from 'react';
import userService from '../services/userService';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await userService.getAllUsers();
      setUsers(response.data || []);

      // Auto-select first user if exists, or use from localStorage
      const savedUserId = localStorage.getItem('currentUserId');
      if (savedUserId) {
        const user = response.data.find(u => u._id === savedUserId);
        if (user) {
          setCurrentUser(user);
        } else if (response.data.length > 0) {
          setCurrentUser(response.data[0]);
          localStorage.setItem('currentUserId', response.data[0]._id);
        }
      } else if (response.data.length > 0) {
        setCurrentUser(response.data[0]);
        localStorage.setItem('currentUserId', response.data[0]._id);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectUser = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUserId', user._id);
  };

  const createUser = async (userData) => {
    try {
      const response = await userService.createUser(userData);
      const newUser = response.data;
      setUsers([...users, newUser]);
      return newUser;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    currentUser,
    users,
    loading,
    selectUser,
    createUser,
    loadUsers
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
