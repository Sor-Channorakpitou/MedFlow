import { useContext, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { socket } from "../services/socket";

export const SocketContext = useContext(null);

export function SocketProvider({ children }) {
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            socket.disconnect();
            return;
        }

        socket.connect();

        socket.emit("join-user", user.id);
        socket.emit("join-role", user.role.name);

        return () => {
            socket.disconnect();
        };

    }, [user]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}