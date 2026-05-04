import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        // Removed the unused 'error' variable
        return null;
      }
    }
    return null;
  });

  // Replaced useState with a constant since we no longer need to update it
  const loading = false;

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Added the ESLint exception to satisfy Vite's Fast Refresh rule
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
