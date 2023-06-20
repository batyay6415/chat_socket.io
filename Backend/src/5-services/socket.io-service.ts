import http from "http";
import socketIo from "socket.io";
import MessageModel from "../2-models/message-model";

// Socket.io logic:
function init(httpServer: http.Server): void {

    // CORS options:
    const options = { cors: { origin: "*" } };

    // Create socket.io server: 
    const socketServer = new socketIo.Server(httpServer, options);

    // 1. Listen to client connections:
    socketServer.sockets.on("connection", (socket: socketIo.Socket) => { // must be event name "connection"
        
        console.log("Client has been connected...");

        // 3. Listen to specific client messages: 
        socket.on("msg-from-client", (msg: MessageModel) => { // msg-from-client is an event we've invented.

            console.log("Client sent message: ", msg);

            // 6. Send specific client message to all clients:
            socketServer.sockets.emit("msg-from-server", msg);
        }); 

        // 7. Listen to specific client disconnect:
        socket.on("disconnect", () => { // must be event "disconnect"
            console.log("Client has been disconnect");
        });

    });

}

export default {
    init
};