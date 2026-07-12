import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { socket, connectSocket } from "../services/socket";
import { SocketContext } from "./SocketContextCore";

export function SocketProvider({ children }) {
    const { user, getAccessToken } = useAuth();

    useEffect(() => {
        if (!user?.id) {
            if (socket.connected) socket.disconnect();
            return;
        }

        const handleConnectError = (err) => {
            console.warn("Socket connect error:", err.message);
            if (err.message === "Unauthorized") {
                const token = getAccessToken();
                if (token) connectSocket(token);
            }
        };

        socket.on("connect_error", handleConnectError);

        if (!socket.connected) {
            const token = getAccessToken();
            if (token) connectSocket(token);
        }

        return () => {
            socket.off("connect_error", handleConnectError);
        };
    }, [user?.id, getAccessToken]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}

export default SocketProvider;