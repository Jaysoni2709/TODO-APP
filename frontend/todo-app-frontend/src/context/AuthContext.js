import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "../../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    const res = await axios.post("/auth/login", credentials);
    const { user, accessToken } = res.data;
    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    setUser(user);

    // Redirect based on role
    if (user.role === "admin") {
      router.push("/admin/users");
    } else {
      router.push("/task/task");
    }
  };

  const logout = async () => {
    await axios.post("/logout");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
