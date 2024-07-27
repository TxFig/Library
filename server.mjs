import dotenv from "dotenv"
dotenv.config()

import { handler } from "./build/handler.js"
import express from "express"
import compression from "compression"

import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


const app = express()

app.use(compression())

const imagesPath = path.join(__dirname, process.env.IMAGES_PATH)
app.use("/images", express.static(imagesPath))

app.use(handler)

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
