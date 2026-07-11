import "socket.io";
import type { AccessPayload } from "../utils/jwt.js";

declare module "socket.io" {
    interface SocketData {
        user?: AccessPayload;
    }
}