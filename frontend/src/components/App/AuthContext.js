import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [mfaVerified, setMfaVerified] = useState(false);

  // Token Decode Helper Function
  function decodeToken(token) {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) throw new Error("Invalid token format");

      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const padded = base64.padEnd(
        base64.length + ((4 - (base64.length % 4)) % 4),
        "="
      );
      return JSON.parse(atob(padded));
    } catch (err) {
      console.error("Failed to decode token:", err);
      return null;
    }
  }

  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      try {
        const payload = decodeToken(token);

        setIsLoggedIn(true);
        setMfaEnabled(payload.mfaEnabled === true);
        setMfaVerified(payload.mfaVerified === true); // <-- this!
      } catch (err) {
        console.error("❌ Failed to decode JWT:", err);
        setIsLoggedIn(false);
        setMfaEnabled(false);
        setMfaVerified(false);
      }
    } else {
      setIsLoggedIn(false);
    }

    setIsLoading(false);
  }, []);

  const login = (token) => {
    Cookies.set("token", token, { expires: 1 });

    const payload = decodeToken(token);
    if (payload) {
      setIsLoggedIn(true);
      setMfaEnabled(payload.mfaEnabled === true);
      setMfaVerified(payload.mfaVerified === true);
    } else {
      setIsLoggedIn(false);
      setMfaEnabled(false);
      setMfaVerified(false);
    }
  };

  const logout = () => {
    Cookies.remove("token");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, isLoading, mfaEnabled, mfaVerified, login, logout }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
