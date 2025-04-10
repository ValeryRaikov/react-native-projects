import { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { getCurrentUser, logout as appwriteLogout } from '../services/appwrite';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
        try {
          const storedSession = await SecureStore.getItemAsync('session');
          if (storedSession) {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
          }
        } catch (error) {
          console.log('AuthContext load error:', error);
          setUser(null);
        } finally {
          setLoading(false);
        }
      };
  
      loadUser();
  }, []);

  const logout = async () => {
    await appwriteLogout();
    await SecureStore.deleteItemAsync('session');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);