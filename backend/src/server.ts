import 'dotenv/config';
import { createServer } from "node:http";
import { app } from ".";
import { Server } from "socket.io";
import { CustomSocket, UserPayload } from "./types/types";
import { getUserConversationsService } from './services/conversationService';
import { UserConnection } from './interfaces/UserConnection';
import { createConversationService } from './services/conversationService';
import { authSocket } from './middlewares/authSocket';
import { createMessageService } from './services/messageService';


const PORT: number = parseInt(process.env.PORT || "3000");

const server = createServer(app);
const io = new Server(server, {
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

io.use(authSocket);

const connectedUsers = new Map<string, UserConnection>();

io.on("connection", async (socket: CustomSocket) => {
  try {
    const userId = socket.user?.userId;

    if (!userId) {
      socket.disconnect();
      return;
    }
    connectedUsers.set(userId, {
      socketId: socket.id,
      status: 'online',
      lastSeen: new Date()
    }
    );
    io.emit("user connected", userId, socket.id);

    const userConversations = await getUserConversationsService(userId);

    userConversations?.forEach(conversation => {
      socket.join(conversation._id.toString());
    });
    socket.on("new conversation", async (data) => {
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

        const newConversation = await createConversationService(conversationData);

        if (!newConversation) {
          socket.emit("error", "Error al crear la conversación");
          return;
        }

        socket.join(newConversation.id);

        participants.forEach((participantId: string) => {
          const participantSocket = connectedUsers.get(participantId);
          if (!participantSocket) {
            socket.emit("error", "Error creating the conversation")
            return 
          }
            io.to(participantSocket.socketId).emit("conversation created", {
              conversationId: newConversation._id,
              participants
            });
        });
        socket.emit("conversation joined", {
          conversationId: newConversation._id,
          participants,
          newConversation
        });

      } catch (error) {
        console.error("Error al crear nueva conversación:", error);
        socket.emit("error", "Error al crear la conversación");
      }
    });

    socket.on("new message", async (message) => {
      try {
        const sender = socket.user?.userId;
        if (!sender || !message) {
          socket.emit("error", "missing data");
          return;
        }
        if (
          typeof message.content !== "string" ||
          typeof message.receiver !== "string" ||
          typeof message.conversationId !== "string" ||
          !message.timestamp
        ) {
          socket.emit("error", "invalid message format");
          return;
        }
        const newMessageData = {
          content: message.content,
          sender,
          receiver: message.receiver,
          conversationId: message.conversationId,
          timestamp: message.timestamp,
        };

        const newMessage = await createMessageService(newMessageData);
        if (!newMessage) {
          socket.emit("error", "Error creating message");
          return;
        }
        io.to(message.conversationId).emit("message created", newMessage);

      } catch (err) {
        console.error("Error creating message", err);
        socket.emit("error", "Error creating message");
      }
    });


  }
  catch (err) { }
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


