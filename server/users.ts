import express, { Request, Response } from "express";
import { users } from "./db";
import { createHash } from "crypto";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

const router = express.Router();

const encrypt = (word: string) => {
    return createHash('sha256').update(word).digest("hex")
}


router.post("/register", async (req, res) => {
    console.log("triggered the register route")
    try {
        const existingUser = await users.findOne({ email: req.body.email });
        if (existingUser) {
            res.status(400).send({ msg: `Email '${req.body.email}' già registrata` });
            return 
        }
        const user = await users.insertOne({
            name: req.body.name,
            role: "user",
            surname: req.body.surname,
            email: req.body.email,
            phone: req.body.phone,
            password: encrypt(req.body.password),
        });
        res.send({
            msg: `Utente ${user.insertedId} creato`
        });
    }
    catch (e) {
        if (e.code === 11000) {
            res.status(400).send({ msg: `Email '${req.body.email}' già registrata` });
        }
        else {
            res.status(500).send({ msg: "Impossibile creare l'utente " + e });
        }
    }
});



router.post("/login", async (req, res) => {
    try {
        const user = await users.findOne(
            {
                email: req.body.email,
                password: encrypt(req.body.password)
            }, 
            { 
                projection: { password: 0 }   
            }
        )
        if(!user){
            res.status(401).send({ msg: "Email o password errati" })
        }
        else {
            const token = jwt.sign(user, "KGJH324234@sdfkbj", { expiresIn: '4h' })
            res.send({ access_token: token })
        }
    }
    catch {

    }
})


router.get("/", async (req, res) => {
    const excludeId = new ObjectId(String(req.query.excludeId))
    try {
        const r = await users.find(
            { _id: { $ne: excludeId } }
        ).toArray();

        res.send({
            usersIds : r
        });
    } catch (e) {
        console.error(e);
        res.status(500).send({
            esito: false,
            msg: "Something is wrong with the server"
        });
    }
});


export const usersWs = router