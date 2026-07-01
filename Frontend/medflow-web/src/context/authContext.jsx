import { useEffect, useState, createContext } from "react";
import * as authAPI from "../services/authAPI";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const initializeAuth = async () => {
        try {
            const res = await authAPI.getCurrentUser();
            setUser(res.user); 
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        initializeAuth();
    }, []);

    const login = async (credentials) => {
        await authAPI.login(credentials);

        const res = await authAPI.getCurrentUser();
        setUser(res.data.user);
    };

    const logout = async () => {
        try {
            await authAPI.logout();
        } finally {
            setUser(null);
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser: initializeAuth,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}