import React, { createContext, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import axiosInstance from "./config/axiosConfig.js"; // ✅ Correct

export const Context = createContext({ isAuthenticated: false });

const AppWrapper = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState({});
  const [loading, setLoading] = useState(true);

  // Check if admin is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axiosInstance.get("/user/admin/me");
        setIsAuthenticated(true);
        setAdmin(data.user);
      } catch (error) {
        setIsAuthenticated(false);
        setAdmin({});
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>; // Prevent flickering

  return (
    <Context.Provider
      value={{ isAuthenticated, setIsAuthenticated, admin, setAdmin }}
    >
      <App />
    </Context.Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);
