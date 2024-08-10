import type { LogEntry } from "@prisma/client";
import { prisma } from ".";


export async function getAll(): Promise<LogEntry[]> {
    return await prisma.logEntry.findMany({
        orderBy: {
            createdAt: "desc"
        }
    })
}

export default {
    getAll
}
