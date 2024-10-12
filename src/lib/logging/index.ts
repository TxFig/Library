import { prisma } from "$lib/server/database";
import { LogLevel } from "@prisma/client";
import chalk from "chalk";


const logLevelColors = {
    "debug": chalk.blue,
    "http": chalk.blue,
    "info": chalk.blue,
    "warn": chalk.yellow,
    "error": chalk.red,
    "fatal": chalk.redBright
}
export async function log(level: LogLevel, message: string, userId?: number, data?: unknown) {
    const metadata = JSON.stringify(data)

    console.log(
        logLevelColors[level](level),
        chalk.green(message),
        chalk.yellow(userId ?? ""),
        chalk.magenta(metadata ?? "")
    )

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

export async function logFatal(error: unknown, message: string, userId?: number) {
    if (error instanceof Error) {
        await log("fatal", message, userId, error.stack)
    } else {
        await log("fatal", "Unknown error", userId, JSON.stringify(error))
    }
}

export default log
