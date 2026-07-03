import { useContext } from "react";
import { SocketContext } from "../context/SocketContext";

export function useSocket() {
    useContext(SocketContext);
};