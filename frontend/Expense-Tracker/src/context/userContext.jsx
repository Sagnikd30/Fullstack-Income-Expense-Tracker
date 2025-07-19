import React, { createContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const updateUser = (userData) => {
    setUser(userData);
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  // Load user from token when app starts
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      axiosInstance
        .get(API_PATHS.AUTH.GET_USER_INFO)
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          console.error("Failed to load user from token:", err);
          clearUser();
        });
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
