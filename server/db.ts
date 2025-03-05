import { MongoClient } from "mongodb";
import { IMessage } from "./models/IMessage";
import { IUser } from "./models/IUser";

//Creating a new mongoDB client using the connection string
const client = new MongoClient("mongodb+srv://jrprecilla365:7kKfuwdVWFUms7hu@chat-cluster.tp3jc.mongodb.net/?retryWrites=true&w=majority&appName=chat-cluster")

//This constant is a reference to the chatA_db database on mongoDB
const db = client.db("chat_db")

//Getting the messages collection from the referenced db as Imessage types
export const messages = db.collection<IMessage>("messages")

//Getting the users collection from the referenced db as IUser types
export const users = db.collection<IUser>("users")