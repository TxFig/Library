import { prisma } from "$lib/server/database";
import { LogLevel } from "@prisma/client";



export async function log(level: LogLevel, message: string, userId?: number, data?: unknown) {
    const metadata = JSON.stringify(data)

    console.log(`${level} ${message} ${userId ?? ""} ${metadata ?? ""}`)

    await prisma.logEntry.create({
        data: {
            level,
            message,
            userId,
            metadata,
        }
    })
}

export async function logError(error: unknown, message: string, userId?: number) {
    if (error instanceof Error) {
        await log("error", message, userId, error.stack)
    } else {
        await log("error", "Unknown error", userId, JSON.stringify(error))
    }
}

export default log
