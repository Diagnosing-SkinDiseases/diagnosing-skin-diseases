import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie"; // Import js-cookie

const AuthContext = createContext();

/**
 * AuthProvider Component
 *
 * Provides an authentication context to child components, managing the login state
 * and authentication token. It uses cookies to persist authentication tokens across sessions.
 *
 * State:
 *   isLoggedIn (Boolean): A state to track whether the user is logged in or not.
 *   isLoading (Boolean): A state to manage the loading state of the authentication check.
 *
 * Effects:
 *   useEffect runs on component mount to check if a user's authentication token exists in cookies
 *   and sets the login state accordingly.
 *
 * Functions:
 *   login (Function): Accepts a token, stores it in cookies, and sets `isLoggedIn` to true.
 *   logout (Function): Removes the token from cookies and sets `isLoggedIn` to false.
 *
 * Props:
 *   children (Node): Child components that can consume the authentication context.
 */
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token"); // Retrieve the token from cookies
    console.log("Retrieved token:", token);
    setIsLoggedIn(!!token); // Set login state based on the presence of a token
    setIsLoading(false); // Set loading state to false after checking token
  }, []);

  const login = (token) => {
    Cookies.set("token", token, { expires: 1 }); // Store the token in cookies with an expiry of 1 day
    setIsLoggedIn(true);
  };

  const logout = () => {
    Cookies.remove("token"); // Clear the token from cookies
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, login, logout }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth Hook
 *
 * Custom hook to access the authentication context. It allows any component in the application
 * to access and modify the authentication state and perform login or logout operations.
 *
 * Returns:
 *   Object containing `isLoggedIn`, `isLoading`, `login`, and `logout` to manage authentication.
 */
export const useAuth = () => useContext(AuthContext);
