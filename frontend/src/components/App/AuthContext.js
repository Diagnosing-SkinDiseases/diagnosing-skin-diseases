import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie"; // Import js-cookie

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token"); // Use Cookies.get to retrieve the token
    console.log("Retrieved token:", token);
    setIsLoggedIn(!!token);
    setIsLoading(false);
  }, []);

  const login = (token) => {
    Cookies.set("token", token, { expires: 1 }); // Use Cookies.set to store the token, with an expiry of 1 day
    setIsLoggedIn(true);
  };

  const logout = () => {
    Cookies.remove("token"); // Use Cookies.remove to clear the token
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, login, logout }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
