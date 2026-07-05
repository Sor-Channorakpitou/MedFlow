import app from "./app.js";
import { Server } from "socket.io";
import http from "http";

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    },
});

app.set("io", io);

io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    
    socket.on("join-user", (userId: number) => {
        socket.join(`user-${userId}`);
    })

    socket.on("join-role", (role: string) => {
        socket.join(role);
    });

    socket.on("disconnect", () => {
        console.log(`Socket disconnected: ${socket.id}`);
    });
})

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
