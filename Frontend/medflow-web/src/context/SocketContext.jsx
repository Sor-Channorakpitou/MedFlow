import {  useEffect } from "react";
import  { useAuth } from "../hooks/useAuth";
import { socket, connectSocket } from "../services/socket";
import { SocketContext } from "./SocketContextCore";


export function SocketProvider({ children }) {
    const { user } = useAuth();
    const userId = user?.id;
    const roleName = user?.role?.name;
    const accessToken = user?.accessToken

    useEffect(() => {
        if (!userId) {
            if (socket.connected) socket.disconnect();
            return;
        }

        const onConnect = () => {
            console.log("Socket connected:", socket.id);
        };

        socket.on("connect", onConnect);
         connectSocket(accessToken);


        if (socket.connected) onConnect();

        return () => {
            socket.off("connect", onConnect);
            
            // socket.disconnect();
        };
    }, [userId, roleName]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}

export default SocketProvider;