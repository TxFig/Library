import dotenv from "dotenv"
dotenv.config()

import { handler } from "./build/handler.js"
import express from "express"
import path from "path"


const app = express()

// @ts-ignore
const imagesPath = path.join(process.env.STATIC, "images")
app.use("/images", express.static(imagesPath))

app.use(handler)

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
