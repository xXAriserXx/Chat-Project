import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from 'cors';
import { messagesWs } from "./messages";
import { usersWs } from "./users";

const app = express()
const http = require("http")
const server = http.createServer(app)
export const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:4200", // Allow the frontend origin
        methods: ["GET", "POST"],
    }
});

export const usersSockets = new Map()

io.on("connection", (socket: any) => {
    const userId = socket.handshake.query.userId
    usersSockets.set(userId, socket.id)
    console.log(`User: ${userId} connected`)
    socket.on("disconnect", () => {
        console.log(`User: ${userId} disconnected`)
        usersSockets.delete(userId)
    });
});

app.use(bodyParser.json());
app.use(cors());

app.use("/messages", messagesWs); 
app.use("/users", usersWs); 

server.listen(3000, () => {
    console.log("Backend avviato e in ascolto sulla porta 3000");
});
