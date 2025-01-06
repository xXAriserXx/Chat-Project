import { ObjectId } from "mongodb";

export interface IMessage {
    _id?: ObjectId
    sender:string,
    receiver:string
    date: Date,
    content:string,
    read:boolean
}