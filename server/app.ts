import bodyParser from "body-parser";
import cors from "cors"
import express, { Application } from "express"
import { messagesWs } from "./messages";
import { usersWs } from "./users";
import http, { Server } from "http";
import { Server as SocketIOServer, Socket} from "socket.io";

//Initialize the express application, which means setting up the express framework so that it can manage http requests and responses
const app:Application = express();

//Creates a server and binds it to the express App, which means setting up a server that connects to the express app that manages requests and responsessho
const server:Server = http.createServer(app);

//Enables the frontEnd and backEnd to comunicate in real time, allowing only connections from a specific url
export const io: SocketIOServer = new SocketIOServer(server, {
    cors: {
        origin: "*"
    }
})

// Creates a map to associate a user's ID with their unique socket ID
export const usersSockets:Map<string, string> = new Map();

//Handles new websockets connections and pairs user's Id with unique socket ID
//Removes user from the map when they disconnect
io.on("connection", (socket:Socket) => {
    const userId = socket.handshake.query.userId as string;
    console.log(`User ${userId} connected`);
    usersSockets.set(userId, socket.id);
    socket.on("disconnect", () => {
        console.log(`User ${socket.id} disconnected`);
        usersSockets.delete(socket.id)
    })
})

//Middleware to parse incoming JSON request bodies. So strings become objects essentially
app.use(bodyParser.json());

//Middleware to allow requests from the frontend that's running on the specified URL  
app.use(cors({
    origin: "*"
}));

// Route handlers for /messages and /users endpoints
app.use("/messages", messagesWs);
app.use("/users", usersWs);

//Starts the server on port 3000 and then logs message to show that server is running
server.listen(3000, () => {
    console.log("Backend listening on port 3000")
})
