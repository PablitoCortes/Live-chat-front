import { io } from "socket.io-client";

const socketUrl =
  process.env.NODE_ENV === "production"
    ? "https://live-chat-back-qjac.onrender.com"
    : "http://localhost:5500";

export const socket = io(socketUrl, {
  withCredentials: true,
  transports: ["websocket"],
});

socket.on("connect_error", (err) => {
  console.error("❌ Error al conectar socket:", err.message);
});

socket.on("connect", () => {
  console.log("✅ Conectado al socket con ID:", socket.id);
});

socket.on("user connected", (userId, socketId) => {
  console.log(`👤 Usuario conectado: ${userId}, socket: ${socketId}`);
});

socket.on("error", (message) => {
  console.error("🚨 Error del servidor:", message);
});
