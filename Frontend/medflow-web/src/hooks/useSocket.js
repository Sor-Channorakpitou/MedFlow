import { useContext } from "react";
import { SocketContext } from "../context/SocketContextCore"; 

export const useSocket = () => useContext(SocketContext);