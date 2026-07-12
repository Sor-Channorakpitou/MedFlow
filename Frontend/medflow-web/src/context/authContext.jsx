import { useEffect, useState, createContext } from "react";
import * as authAPI from "../services/authAPI";
import { setAccessToken } from "../services/api";
import { connectSocket, disconnectSocket } from "../services/socket";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [accessToken, setAccessTokenState] = useState(null);

    const initializeAuth = async () => {
        try {

            // get new access token using refreshToken cookie
            const tokenRes = await authAPI.refresh();

            setAccessToken(tokenRes.accessToken);
            setAccessTokenState(tokenRes.accessToken);

            // connect websocket
            connectSocket(tokenRes.accessToken);

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

        // save access token in memory
        setAccessToken(res.accessToken);
        setAccessTokenState(res.accessToken);

        // connect web socket
        connectSocket(res.accessToken);

        const userRes = await authAPI.getCurrentUser();
        setUser(userRes.user);
        return userRes.user;
    };

    const logout = async () => {
        try {
            await authAPI.logout();
        } finally {
            disconnectSocket();
            setAccessToken(null);
            setAccessTokenState(null);
            setUser(null);
        }
    };

    const updateCurrentUser = (updates) => {
        setUser((prev) => ({
            ...prev,
            ...updates,
        }));
    };

    const getAccessToken = () => accessToken;

    const value = {
        user,
        updateCurrentUser,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser: initializeAuth,
        getAccessToken,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}