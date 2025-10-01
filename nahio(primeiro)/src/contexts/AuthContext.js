import React, { createContext, useContext, useEffect, useState } from 'react';
import AuthService from '../services/authService';
import { Alert } from 'react-native'; 

const AuthContext = createContext(null); 

export const useAuth = () => {
 const context = useContext(AuthContext);
 if (!context) {
   throw new Error('useAuth deve ser usado dentro de um AuthProvider');
 }
 return context;
};

export const AuthProvider = ({ children }) => {
 const [user, setUser] = useState(null);
 const [userData, setUserData] = useState(null);
 const [loading, setLoading] = useState(true); 
 const [isAuthenticated, setIsAuthenticated] = useState(false);

 useEffect(() => {
   const unsubscribe = AuthService.onAuthStateChange(async (firebaseUser) => {
     if (firebaseUser) {
       setUser(firebaseUser);
       
       const result = await AuthService.getUserData(firebaseUser.uid);
       if (result.success) {
         setUserData(result.userData);
         setIsAuthenticated(true);
       } else {
         console.error('Erro ao buscar dados do usuário:', result.error);
         AuthService.logout(); 
         setIsAuthenticated(false);
       }
     } else {
       setUser(null);
       setUserData(null);
       setIsAuthenticated(false);
     }
     setLoading(false); 
   });
   return unsubscribe;
 }, []);


 const login = async (email, password) => {
   try {
     const result = await AuthService.login(email, password);
     if (result.success) {
       return { success: true };
     } else {
       return { success: false, error: result.error || 'Erro desconhecido no login.' };
     }
   } catch (error) {
     console.error("AuthContext Login Error:", error);
     return { success: false, error: 'Ocorreu um erro no sistema. Tente novamente.' };
   }
 };
   
 const logout = async () => {
   try {
     await AuthService.logout();
   } catch (error) {
     console.error("Logout Error:", error);
     Alert.alert("Erro", "Não foi possível desconectar.");
   }
 };

 const value = {
    user,
    userData,
    loading,
    isAuthenticated,
    login,
    logout,
    // ... (outras funções)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};