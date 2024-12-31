import { ObjectId } from "mongodb";

export interface IMessage {
    sender:string,
    receiver:string
    date: Date,
    content:string,
    read:boolean
}