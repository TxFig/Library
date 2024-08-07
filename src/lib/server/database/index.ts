import { dev } from "$app/environment"
import { PrismaClient } from "@prisma/client"

declare global {
    var prismaClient: PrismaClient
}


export const prisma = getPrismaClientInstance()

function getPrismaClientInstance() {
    if (dev) {
        global.prismaClient ??= new PrismaClient()
        return global.prismaClient
    }

    return new PrismaClient()
}

export async function close() {
    await prisma.$disconnect()
}


import books from "./books"
import auth from "./auth"
import activityLog from "./activity-log"
import config from "./config"

export default {
    books,
    auth,
    activityLog,
    close,
    config
}
