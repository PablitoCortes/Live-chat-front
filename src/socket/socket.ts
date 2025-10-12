import { io } from "socket.io-client";

export const socket = io("http://localhost:5500", {
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
