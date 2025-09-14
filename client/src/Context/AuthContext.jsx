import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null); 
  const [token, setToken] = useState(null);


  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");

    if (savedToken && savedRole) {
      setToken(savedToken);
      setRole(savedRole);
    }
  }, []);

  const login = (newToken, newRole) => {
    setToken(newToken);
    setRole(newRole);

    localStorage.setItem("token", newToken);
    localStorage.setItem("role", newRole);
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
