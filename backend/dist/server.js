"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const node_http_1 = require("node:http");
const _1 = require(".");
const socket_io_1 = require("socket.io");
const authSocket_1 = require("./middlewares/authSocket");
const conversationService_1 = require("./services/conversationService");
const conversationService_2 = require("./services/conversationService");
const PORT = parseInt(process.env.PORT || "3000");
const server = (0, node_http_1.createServer)(_1.app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3001",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
        preflightContinue: false,
        optionsSuccessStatus: 204
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    connectTimeout: 10000
});
io.engine.on("connection_error", (err) => {
    console.error("Error de conexión:", err);
});
io.use(authSocket_1.authSocket);
const connectedUsers = new Map();
io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = socket.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            socket.disconnect();
            return;
        }
        connectedUsers.set(userId, {
            socketId: socket.id,
            status: 'online',
            lastSeen: new Date()
        });
        io.emit("user connected", userId, socket.id);
        const userConversations = yield (0, conversationService_1.getUserConversationsService)(userId);
        userConversations === null || userConversations === void 0 ? void 0 : userConversations.forEach(conversation => {
            socket.join(conversation._id.toString());
        });
        socket.on("new conversation", (data) => __awaiter(void 0, void 0, void 0, function* () {
            console.log("Servicor recibió new conversation", data);
            try {
                const { participants } = data;
                if (!participants.includes(userId)) {
                    socket.emit("error", "No tienes permiso para crear esta conversación");
                    return;
                }
                const conversationData = {
                    participants,
                    creationDate: new Date()
                };
                const newConversation = yield (0, conversationService_2.createConversationService)(conversationData);
                if (!newConversation) {
                    socket.emit("error", "Error al crear la conversación");
                    return;
                }
                socket.join(newConversation.id);
                participants.forEach((participantId) => {
                    const participantSocket = connectedUsers.get(participantId);
                    if (participantSocket) {
                        io.to(participantSocket.socketId).emit("conversation created", {
                            conversationId: newConversation._id,
                            participants
                        });
                        console.log("Servidor: emití conversation created a", participantSocket.socketId);
                    }
                });
                socket.emit("conversation joined", {
                    conversationId: newConversation._id,
                    participants
                });
            }
            catch (error) {
                console.error("Error al crear nueva conversación:", error);
                socket.emit("error", "Error al crear la conversación");
            }
        }));
    }
    catch (err) { }
}));
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
