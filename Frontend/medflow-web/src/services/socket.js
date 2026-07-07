import { io } from "socket.io-client";

export const socket = io("http://localhost:3000", {
    autoConnect: false,
    withCredentials: true,
});

export function connectSocket(accessToken) {
    socket.auth = {
        token: accessToken,
    };

    if (!socket.connected) {
        socket.connect();
    }
}

export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
    }
};