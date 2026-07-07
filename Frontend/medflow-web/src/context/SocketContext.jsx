import { createContext, useEffect } from "react";
import  { useAuth } from "../hooks/useAuth";
import { socket } from "../services/socket";
import { SocketContext } from "./SocketContextCore";

export function SocketProvider({ children }) {
    const { user } = useAuth();
    const userId = user?.id;
    const roleName = user?.role?.name;

    useEffect(() => {
        if (!userId) {
            if (socket.connected) socket.disconnect();
            return;
        }

        const onConnect = () => {
            socket.emit("join-user", userId);
            if (roleName) socket.emit("join-role", roleName);
        };

        socket.on("connect", onConnect);
        if (socket.connected) onConnect();
        else socket.connect();

        return () => {
            socket.off("connect", onConnect);
            socket.disconnect();
        };
    }, [userId, roleName]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}

export default SocketProvider;