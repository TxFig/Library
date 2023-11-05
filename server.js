import dotenv from "dotenv"
dotenv.config()

import { handler } from "./build/handler.js"
import express from "express"


const app = express()

app.use("/images", express.static(process.env.IMAGES_PATH))
app.use(handler)

app.listen(3000, () => {
    console.log("Listening on port 3000")
})
