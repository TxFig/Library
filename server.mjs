import dotenv from "dotenv"
import path from "path"
import chalk from "chalk";
import { z } from "zod"
import { PrismaClient } from "@prisma/client"
import express from "express"
import { handler } from "./build/handler.js"


dotenv.config()

const envVariablesSchema = z.object({
    STATIC: z.string().min(1, "STATIC required").refine(path.isAbsolute, "STATIC must be an absolute path"),
    PORT: z.coerce.number().min(1).max(65535).default(3000),
    RESTART: z.string().optional().default("always"),
    ORIGIN: z.string().url().min(1, "Required"),

    DATABASE_URL: z.string().min(1, "Required").url(),

    EMAIL_HOST: z.string().min(1, "Required").refine(url => {
        try {
            new URL(`https://${url}`)
            return true
        }
        catch { return false }
    }),
    EMAIL_PORT: z.coerce.number().min(1, "Required").default(25),
    EMAIL_USER: z.string().email().min(1, "Required"),
    EMAIL_PASSWORD: z.string().min(1, "Required"),
    EMAIL_FROM: z.string().email().min(1, "Required"),

    EMAIL_CONFIRMATION_EXPIRATION_TIME: z.coerce.number().max(86400).default(600),
    SESSION_EXPIRATION_TIME: z.coerce.number().max(31536000).default(2592000),

    SESSION_COOKIE_NAME: z.string().default("sessionToken"),

    ADMIN_EMAIL: z.optional(z.string().email()),

    MAX_IMAGE_UPLOAD_SIZE: z.coerce.number().min(1).default(16000000),
    BODY_SIZE_LIMIT: z.coerce.number().min(1).default(64000000),
}).refine(envVariables =>
    envVariables.BODY_SIZE_LIMIT > envVariables.MAX_IMAGE_UPLOAD_SIZE,
    "BODY_SIZE_LIMIT must be greater than MAX_IMAGE_UPLOAD_SIZE"
)

console.log(chalk.blue("Validating environment variables..."))
const result = envVariablesSchema.safeParse(process.env)
if (!result.success) {
    const formatted = result.error.format()
    delete formatted._errors
    const errors = Object.entries(formatted).map(([key, value]) =>
        `    - ${key}: ${value._errors[0]}`
    ).join("\n")
    console.log(chalk.red("Invalid environment variables. Errors:"))
    console.log(chalk.red(errors))
    console.log(chalk.blue("See .env.example for an example."))
    process.exit(1)
}

console.log(chalk.green("Environment variables are valid."))

const prisma = new PrismaClient()

console.log(chalk.cyan("Library server starting..."))
console.log()

const app = express()

app.use((req, res, next) => {
    res.on("finish", async () => {
        const message = `${req.method} ${req.url} ${res.statusCode}`
        console.log(
            chalk.blue("http"),
            chalk.green(`${req.method} ${req.url}`),
            chalk.yellow(res.statusCode),
        )

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
    console.log(chalk.gray(`Listening on port ${port}`))
})
