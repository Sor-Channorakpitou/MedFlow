import { Socket } from "socket.io";
import { verifyAccessToken } from "../utils/jwt.js";

export function socketAuth(socket: Socket, next: (err?: Error) => void) {
    try {
        const token = socket.handshake.auth.token;
console.log("Token:", token);

        if (!token) {
            return next(new Error("Unauthorized"));
        }

        socket.data.user = verifyAccessToken(token);
console.log("Authenticated user:", socket.data.user);
        next();
    } catch {
        next(new Error("Unauthorized"));
    }
}