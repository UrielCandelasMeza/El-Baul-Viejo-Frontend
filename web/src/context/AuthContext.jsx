import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, verifyToken } from "../connection/auth";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

const AuthProvider = ({children}) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await verifyToken();
        setUser(res.data.user);
        setIsAuthenticated(true);
      } catch (error) {
        if(error.response.data.error){
          setError(error.response.data.error);
        } else {
          setError(error.response.data.message)
        }
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [])

  const login = async (data) => {
   try {
    setLoading(true);
    setError(null);
    const res = await loginUser(data);
    console.log(res.data.user)
    setUser(res.data.user);
    setIsAuthenticated(true);
   } catch (error) {
    if(error.response.data.error){
      setError(error.response.data.error);
    } else {
      setError(error.response.data.message)
    }
   } finally {
    setLoading(false);
   }
  }

  return (
    <AuthContext.Provider value={{user, loading, error, isAuthenticated, login, setError}}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;