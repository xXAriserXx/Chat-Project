import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { messages, users } from "./db";
import { io, usersSockets } from "./app";

const router = express()

router.get("/get/:senderId/:receiverId", async (req, res) => { //The following only retrieves the messages that were sent by the sender
    try { 
        if (!ObjectId.isValid(req.params.senderId) || !ObjectId.isValid(req.params.receiverId)) { 
            res.status(404).send({ msg: `One or both are not valid: ${req.params.senderId}, ${req.params.receiverId}` });
            return
        }
        const senderId = req.params.senderId;
        const receiverId = req.params.receiverId;
        const foundMessages = await messages.find({
            $or: [
                { sender: senderId, receiver: receiverId},
                { sender: receiverId, receiver: senderId }
            ] 
        }).toArray();

        if (foundMessages.length === 0) {
            res.status(404).send({ msg: `No messages found for: ${req.params.senderId}, ${req.params.receiverId}` });
            return
        }

        res.send(foundMessages);
    }
    catch (err) {
        res.status(500).send({ msg: `Some kind of server error` });
    }
});

router.post("/post", async (req, res) => {
    try {
        const socketId = usersSockets.get(req.body.receiver) 
        io.to(socketId).emit("received_message", req.body)
        const message = await messages.insertOne({
            sender: req.body.sender,
            receiver: req.body.receiver,
            date: req.body.date,
            content: req.body.content,
            read: false
        })
        res.send({msg: `${req.body.sender} sent a message with id ${message.insertedId} to ${req.body.receiver}`})
    }
    catch {
        res.status(500).send("Error")
    }

})

router.patch("/patch/:senderId/:receiverId", async (req, res) => {
    console.log(`Patch request received, sender: ${req.params.senderId}, receiver: ${req.params.receiverId}`);
    try {
        const senderId = req.params.senderId;
        const receiverId = req.params.receiverId;
        const updatedMessages = await messages.updateMany(
            { receiver:senderId, sender:receiverId },
            { $set: { read: true } }
        )
    } 
    catch {
        res.status(500).send("Error")
    }
})

export const messagesWs = router;
