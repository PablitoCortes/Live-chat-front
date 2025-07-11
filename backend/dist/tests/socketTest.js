"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
// Simular dos usuarios
const user1 = (0, socket_io_client_1.io)("http://localhost:3000", {
    auth: {
        token: "token-usuario-1", // Reemplaza con un token válido
    },
});
const user2 = (0, socket_io_client_1.io)("http://localhost:3000", {
    auth: {
        token: "token-usuario-2", // Reemplaza con un token válido
    },
});
// Escuchar conexión
user1.on("connect", () => {
    console.log("Usuario 1 conectado");
});
user2.on("connect", () => {
    console.log("Usuario 2 conectado");
});
// Escuchar mensajes
user1.on("new_message", (message) => {
    console.log("Usuario 1 recibió mensaje:", message);
});
user2.on("new_message", (message) => {
    console.log("Usuario 2 recibió mensaje:", message);
});
// Simular envío de mensaje
setTimeout(() => {
    user1.emit("send_message", {
        conversationId: "id-conversacion",
        content: "Hola, ¿cómo estás?",
        receiverId: "id-usuario-2",
    });
}, 2000);
// Cerrar conexiones después de 5 segundos
setTimeout(() => {
    user1.close();
    user2.close();
    process.exit(0);
}, 5000);
