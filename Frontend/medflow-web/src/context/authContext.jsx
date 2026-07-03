import { useEffect, useState, createContext, use } from "react";
import * as authAPI from "../services/authAPI";
import { setAccessToken } from "../services/api";

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
        const res = await authAPI.login(credentials);
        setAccessToken(res.accessToken); 

        const userRes = await authAPI.getCurrentUser();
        setUser(userRes.user);
        return userRes.user; 
    };

    const logout = async () => {
        try {
            await authAPI.logout();
        } finally {
            setAccessToken(null); 
            setUser(null);
        }
    };

    const updateCurrentUser = (updates) => {
        setUser((prev) => ({
            ...prev,
            ...updates,
        }
    ));
};

    const value = {
        user,
        updateCurrentUser,
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