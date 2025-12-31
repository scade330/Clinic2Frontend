import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // Current logged-in user
  const [loading, setLoading] = useState(true); // Loading state during auth check

  // Fetch current user from backend using JWT cookie on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/user/me`,
          {
            withCredentials: true, // send cookie to backend
          }
        );
        setUser(data.user || data); // set user if valid
      } catch (err) {
        setUser(null);             // not logged in
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Login: store user in state
  const login = (userData) => {
    setUser(userData);
  };

  // Logout: clear backend cookie and reset user
  const logout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/logout-user`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook for using the user context
export const useUser = () => useContext(UserContext);

export default UserContext;
