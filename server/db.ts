import { MongoClient } from "mongodb";
import { IMessage } from "./models/IMessage";
import { IUser } from "./models/IUser";

const client = new MongoClient("mongodb+srv://jrprecilla365:7kKfuwdVWFUms7hu@chat-cluster.tp3jc.mongodb.net/?retryWrites=true&w=majority&appName=chat-cluster")
const db = client.db("chat_db")

export const messages = db.collection<IMessage>("messages")
export const users = db.collection<IUser>("users")