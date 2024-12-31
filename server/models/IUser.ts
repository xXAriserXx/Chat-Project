import { ObjectId } from "mongodb"

export interface IUser {
    role: string,
    name: string,
    surname: string,
    email: string,
    phone: number,
    password: string
}
