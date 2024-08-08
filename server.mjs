import dotenv from "dotenv"
dotenv.config()

// @ts-ignore
import { handler } from "./build/handler.js"
import express from "express"
import path from "path"

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()


const app = express()

app.use((req, res, next) => {
    res.on("finish", async () => {
        const message = `${req.method} ${req.url} ${res.statusCode}`
        console.log(message)

        await prisma.logEntry.create({
            data: {
                level: "http",
                message,
            }
        })
    })
    next()
})

// @ts-ignore
const imagesPath = path.join(process.env.STATIC, "images")
app.use("/images", express.static(imagesPath))

app.use(handler)

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
