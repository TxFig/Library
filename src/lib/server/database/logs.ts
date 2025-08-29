import type { LogEntry } from "@prisma/client";
import prisma from "$lib/server/database/prisma"
import type { LogLevel } from "@prisma/client";
import chalk from "chalk";
import type { InputJsonValue } from "@prisma/client/runtime/library";


export async function getAll(): Promise<LogEntry[]> {
    return await prisma.logEntry.findMany({
        orderBy: {
            createdAt: "desc"
        }
    })
}

const logLevelColors = {
    "debug": chalk.blue,
    "http": chalk.blue,
    "info": chalk.blue,
    "warn": chalk.yellow,
    "error": chalk.red,
    "fatal": chalk.redBright
}
export async function log(level: LogLevel, message: string, data?: InputJsonValue) {
    const metadata = JSON.stringify(data)

    console.log(
        logLevelColors[level](level),
        chalk.green(message),
        chalk.magenta(metadata ?? "")
    )

    try {
        await prisma.logEntry.create({
            data: {
                level,
                message,
                metadata: data,
            }
        })
    } catch (err) {
        console.log("Error saving log entry")
        console.error(err)
    }
}

export async function logError(error: unknown, message: string, data?: InputJsonValue) {
    if (error instanceof Error) {
        await log("error", message, {
            stack: error.stack,
            data
        })
    } else {
        await log("error", "Unknown error", {
            error: JSON.stringify(error),
            data
        })
    }
}

export async function logFatal(error: unknown, message: string) {
    if (error instanceof Error) {
        await log("fatal", message, error.stack)
    } else {
        await log("fatal", "Unknown error", JSON.stringify(error))
    }
}


export default {
    getAll,
    log,
    logError,
    logFatal
}
