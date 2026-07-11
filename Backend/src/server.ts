import app from "./app.js";
import { Server } from "socket.io";
import http from "http";
import { socketAuth } from "./sockets/auth.js";

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

export const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true,
    },
});

io.use(socketAuth);

app.set("io", io);

io.on("connection", (socket) => {
    const user = socket.data.user;

    console.log(
        `Socket connected: ${socket.id} (${user.username})`
    );


    // Automatically join personal room
    socket.join(`user:${user.id}`);


    // Automatically join role room
    socket.join(user.role);


    console.log(
        `Joined rooms: user:${user.id}, ${user.role}`
    );


    socket.on("disconnect", () => {
        console.log(`Socket disconnected: ${socket.id}`);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

function shutdown(callback?: () => void) {
    console.log("Shutting down gracefully...");
    io.close(() => {
        server.close(() => {
            if (callback) callback();
            else process.exit(0);
        });
    });
    setTimeout(() => process.exit(1), 3000);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
process.once("SIGUSR2", () => {
    shutdown(() => process.kill(process.pid, "SIGUSR2"));
});
